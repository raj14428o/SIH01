#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

// ---------------- File overwrite helpers ----------------

// Overwrite with a fixed byte (zeros, ones, etc.)
void overwriteFileWithPattern(const std::string &filePath, char fillByte) {
    std::uintmax_t fileSize = fs::file_size(filePath);
    std::ofstream file(filePath, std::ios::binary | std::ios::in | std::ios::out);
    if (!file.is_open()) {
        std::cerr << "Error: Cannot open file " << filePath << "\n";
        return;
    }

    const size_t bufferSize = 4096;
    char buffer[bufferSize];
    std::fill(std::begin(buffer), std::end(buffer), fillByte);

    std::uintmax_t remaining = fileSize;
    while (remaining > 0) {
        std::size_t toWrite = (remaining > bufferSize) ? bufferSize : static_cast<std::size_t>(remaining);
        file.write(buffer, toWrite);
        remaining -= toWrite;
    }
    file.close();
}

// Overwrite with random data
void overwriteFileWithRandom(const std::string &filePath) {
    std::uintmax_t fileSize = fs::file_size(filePath);
    std::ofstream file(filePath, std::ios::binary | std::ios::in | std::ios::out);
    if (!file.is_open()) {
        std::cerr << "Error: Cannot open file " << filePath << "\n";
        return;
    }

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<unsigned char> dist(0, 255);

    const size_t bufferSize = 4096;
    char buffer[bufferSize];

    std::uintmax_t remaining = fileSize;
    while (remaining > 0) {
        std::size_t toWrite = (remaining > bufferSize) ? bufferSize : static_cast<std::size_t>(remaining);
        for (std::size_t i = 0; i < toWrite; ++i) {
            buffer[i] = static_cast<char>(dist(gen));
        }
        file.write(buffer, toWrite);
        remaining -= toWrite;
    }
    file.close();
}

// ---------------- Folder secure cleanup ----------------

void secureDeleteFolder(const std::string &folderPath) {
    if (!fs::exists(folderPath) || !fs::is_directory(folderPath)) {
        std::cerr << "Error: Folder does not exist or is not a directory.\n";
        return;
    }

    for (auto &entry : fs::recursive_directory_iterator(folderPath)) {
        if (fs::is_regular_file(entry.path())) {
            std::string filePath = entry.path().string();

            // DoD 7-pass overwrite for each file
            overwriteFileWithRandom(filePath);        // Pass 1
            overwriteFileWithPattern(filePath, 0x00); // Pass 2
            overwriteFileWithPattern(filePath, 0xFF); // Pass 3
            overwriteFileWithRandom(filePath);        // Pass 4
            overwriteFileWithPattern(filePath, 0x00); // Pass 5
            overwriteFileWithPattern(filePath, 0xFF); // Pass 6
            overwriteFileWithRandom(filePath);        // Pass 7

            // Delete file after overwrite
            std::error_code ec;
            if (fs::remove(filePath, ec)) {
                std::cout << "Deleted securely: " << filePath << "\n";
            } else {
                std::cerr << "Error deleting " << filePath << ": " << ec.message() << "\n";
            }
        }
    }

    // Finally remove empty directories
    std::error_code ec;
    fs::remove_all(folderPath, ec);
    if (!ec) {
        std::cout << "Folder securely cleaned up: " << folderPath << "\n";
    } else {
        std::cerr << "Error removing folder: " << ec.message() << "\n";
    }
}

// ---------------- Main ----------------

int main() {
    std::string folderPath;
    std::cout << "Enter folder path to securely clean: ";
    std::getline(std::cin, folderPath);

    secureDeleteFolder(folderPath);

    return 0;
}
