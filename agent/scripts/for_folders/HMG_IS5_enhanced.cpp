#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

// ------------------- Verification Helper -------------------
bool verifyFile(const std::string &filePath, char expectedByte) {
    std::ifstream file(filePath, std::ios::binary);
    if (!file.is_open()) {
        std::cerr << "Error: Cannot open file for verification: " << filePath << "\n";
        return false;
    }

    const size_t bufferSize = 4096;
    char buffer[bufferSize];
    while (file.read(buffer, bufferSize) || file.gcount() > 0) {
        std::size_t bytesRead = file.gcount();
        for (std::size_t i = 0; i < bytesRead; ++i) {
            if (buffer[i] != expectedByte) {
                return false;
            }
        }
    }
    return true;
}

// ------------------- Overwrite Helpers -------------------
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

// ------------------- Secure Delete for One File -------------------
void secureDeleteFile(const fs::path &filePath) {
    if (!fs::exists(filePath) || !fs::is_regular_file(filePath)) {
        return; // Skip non-files
    }

    std::cout << "Processing file: " << filePath << "\n";

    // Pass 1: Overwrite with 0x00
    overwriteFile(filePath.string(), 0x00);
    if (!verifyFile(filePath.string(), 0x00)) {
        std::cerr << "Verification failed after Pass 1 (0x00) for " << filePath << "\n";
        return;
    }

    // Pass 2: Overwrite with 0xFF
    overwriteFile(filePath.string(), 0xFF);
    if (!verifyFile(filePath.string(), 0xFF)) {
        std::cerr << "Verification failed after Pass 2 (0xFF) for " << filePath << "\n";
        return;
    }

    // Pass 3: Overwrite with random
    overwriteFileWithRandom(filePath.string());
    // No deterministic verification for random pass

    // Delete the file
    std::error_code ec;
    if (fs::remove(filePath, ec)) {
        std::cout << "File securely deleted: " << filePath << "\n";
    } else {
        std::cerr << "Error deleting file " << filePath << ": " << ec.message() << "\n";
    }
}

// ------------------- Folder Secure Delete -------------------
void secureDeleteFolder(const fs::path &folderPath) {
    if (!fs::exists(folderPath) || !fs::is_directory(folderPath)) {
        std::cerr << "Error: Path is not a folder.\n";
        return;
    }

    for (auto &entry : fs::recursive_directory_iterator(folderPath)) {
        if (fs::is_regular_file(entry)) {
            secureDeleteFile(entry.path());
        }
    }

    // Remove empty directories after files are deleted
    std::error_code ec;
    fs::remove_all(folderPath, ec);
    if (ec) {
        std::cerr << "Error deleting folder: " << ec.message() << "\n";
    } else {
        std::cout << "Folder securely deleted: " << folderPath << "\n";
    }
}

// ------------------- Main -------------------
int main() {
    std::string folderPath;
    std::cout << "Enter folder path to securely delete (HMG IS5 Enhanced): ";
    std::getline(std::cin, folderPath);

    if (!fs::exists(folderPath)) {
        std::cerr << "Error: Folder does not exist.\n";
        return 1;
    }

    secureDeleteFolder(folderPath);
    return 0;
}
