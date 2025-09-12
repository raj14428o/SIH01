#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

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
    std::cout << "Enter file path to securely overwrite (DoD 7-pass): ";
    std::getline(std::cin, filePath);

    if (!fs::exists(filePath)) {
        std::cerr << "Error: File does not exist.\n";
        return 1;
    }

    // DoD 7-pass standard (3 random, 3 complements, final random)
    overwriteFileWithRandom(filePath);        // Pass 1: random
    overwriteFileWithPattern(filePath, 0x00); // Pass 2: zeros
    overwriteFileWithPattern(filePath, 0xFF); // Pass 3: ones
    overwriteFileWithRandom(filePath);        // Pass 4: random
    overwriteFileWithPattern(filePath, 0x00); // Pass 5: zeros
    overwriteFileWithPattern(filePath, 0xFF); // Pass 6: ones
    overwriteFileWithRandom(filePath);        // Pass 7: random

    std::cout << "DoD 7-pass overwrite complete for: " << filePath << "\n";

    // Delete the file after overwrite
    std::error_code ec;
    if (fs::remove(filePath, ec)) {
        std::cout << "File successfully deleted.\n";
    } else {
        std::cerr << "Error deleting file: " << ec.message() << "\n";
    }

    return 0;
}
