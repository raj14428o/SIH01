#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

void overwriteFileWithRandom(const std::string &filePath) {
    try {
        // Get file size
        std::uintmax_t fileSize = fs::file_size(filePath);

        // Open file in binary read/write mode
        std::ofstream file(filePath, std::ios::binary | std::ios::in | std::ios::out);
        if (!file.is_open()) {
            std::cerr << "Error: Cannot open file " << filePath << "\n";
            return;
        }

        // Random generator
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<unsigned char> dist(0, 255);

        const size_t bufferSize = 4096;
        char buffer[bufferSize];

        std::uintmax_t remaining = fileSize;
        while (remaining > 0) {
            std::size_t toWrite = (remaining > bufferSize) ? bufferSize : static_cast<std::size_t>(remaining);

            // Fill buffer with random bytes
            for (std::size_t i = 0; i < toWrite; ++i) {
                buffer[i] = static_cast<char>(dist(gen));
            }

            file.write(buffer, toWrite);
            remaining -= toWrite;
        }

        file.close();
        std::cout << "File overwritten with random data: " << filePath << "\n";
    }
    catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }
}

int main() {
    std::string filePath;
    std::cout << "Enter file path to overwrite: ";
    std::getline(std::cin, filePath);

    if (!fs::exists(filePath)) {
        std::cerr << "Error: File does not exist.\n";
        return 1;
    }

    overwriteFileWithRandom(filePath);
    return 0;
}
