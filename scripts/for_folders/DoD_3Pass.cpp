#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

// --- File overwrite helpers (same as before) ---

void overwriteFile(const std::string &filePath, char fillByte) {
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

// --- Secure delete folder (DoD 3-pass per file) ---

void secureDeleteFolder(const fs::path &folderPath) {
    for (auto &entry : fs::recursive_directory_iterator(folderPath, fs::directory_options::skip_permission_denied)) {
        if (fs::is_regular_file(entry.path())) {
            try {
                // DoD 3-pass overwrite
                overwriteFile(entry.path().string(), 0x00);       // Pass 1: zeros
                overwriteFile(entry.path().string(), 0xFF);       // Pass 2: ones
                overwriteFileWithRandom(entry.path().string());   // Pass 3: random

                std::error_code ec;
                if (fs::remove(entry.path(), ec)) {
                    std::cout << "Deleted securely: " << entry.path() << "\n";
                } else {
                    std::cerr << "Error deleting file " << entry.path() << ": " << ec.message() << "\n";
                }
            } catch (const std::exception &e) {
                std::cerr << "Error processing file " << entry.path() << ": " << e.what() << "\n";
            }
        }
    }

    // Delete folder structure
    std::error_code ec;
    fs::remove_all(folderPath, ec);
    if (ec) {
        std::cerr << "Error deleting folder " << folderPath << ": " << ec.message() << "\n";
    } else {
        std::cout << "Folder securely deleted: " << folderPath << "\n";
    }
}

// --- Main (folder-only) ---

int main() {
    std::string folderPath;
    std::cout << "Enter folder path to securely delete (DoD 3-pass): ";
    std::getline(std::cin, folderPath);

    fs::path path(folderPath);

    if (!fs::exists(path)) {
        std::cerr << "Error: Folder does not exist.\n";
        return 1;
    }

    if (!fs::is_directory(path)) {
        std::cerr << "Error: Path is not a folder.\n";
        return 1;
    }

    secureDeleteFolder(path);

    return 0;
}
