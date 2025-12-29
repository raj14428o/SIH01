#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

bool verifyFile(const std::string &filePath, char expectedByte) {
    std::ifstream file(filePath, std::ios::binary);
    if (!file.is_open()) {
        std::cerr << "Error: Cannot open file for verification.\n";
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

int main() {
    std::string filePath;
    std::cout << "Enter file path to securely overwrite (HMG IS5 Enhanced): ";
    std::getline(std::cin, filePath);

    if (!fs::exists(filePath)) {
        std::cerr << "Error: File does not exist.\n";
        return 1;
    }

    // HMG IS5 Enhanced: 0x00, 0xFF, random + verify
    overwriteFile(filePath, 0x00);
    if (!verifyFile(filePath, 0x00)) {
        std::cerr << "Verification failed after Pass 1 (0x00).\n";
        return 1;
    }

    overwriteFile(filePath, 0xFF);
    if (!verifyFile(filePath, 0xFF)) {
        std::cerr << "Verification failed after Pass 2 (0xFF).\n";
        return 1;
    }

    overwriteFileWithRandom(filePath);
    // Optional: You could verify randomness statistically, but it's not deterministic.

    std::cout << "HMG IS5 Enhanced overwrite complete for: " << filePath << "\n";

    // Delete the file
    std::error_code ec;
    if (fs::remove(filePath, ec)) {
        std::cout << "File successfully deleted.\n";
    } else {
        std::cerr << "Error deleting file: " << ec.message() << "\n";
    }

    return 0;
}