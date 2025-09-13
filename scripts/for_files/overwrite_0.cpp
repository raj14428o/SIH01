#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
namespace fs = std::filesystem;

void overwriteFileWithZeros(const std::string &filePath) {
    try {
        // Get file size
        std::uintmax_t fileSize = fs::file_size(filePath);

        // Open file in binary output mode
        std::ofstream file(filePath, std::ios::binary | std::ios::in | std::ios::out);
        if (!file.is_open()) {
            std::cerr << "Error: Cannot open file " << filePath << "\n";
            return;
        }

        // Create a buffer of zeros
        const size_t bufferSize = 4096;
        char buffer[bufferSize] = {0};

        std::uintmax_t remaining = fileSize;
        while (remaining > 0) {
            std::size_t toWrite = (remaining > bufferSize) ? bufferSize : static_cast<std::size_t>(remaining);
            file.write(buffer, toWrite);
            remaining -= toWrite;
        }

        file.close();
        std::cout << "File overwritten with zeros: " << filePath << "\n";
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

    overwriteFileWithZeros(filePath);
    return 0;
}