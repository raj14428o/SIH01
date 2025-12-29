#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>

namespace fs = std::filesystem;

void overwriteFileWithOnes(const std::string &filePath) {
    try {
        std::uintmax_t fileSize = fs::file_size(filePath);

        std::ofstream file(filePath, std::ios::binary | std::ios::in | std::ios::out);
        if (!file.is_open()) {
            std::cerr << "Error: Cannot open file " << filePath << "\n";
            return;
        }

        const size_t bufferSize = 4096;
        char buffer[bufferSize];
        std::fill(std::begin(buffer), std::end(buffer), static_cast<char>(0xFF));

        std::uintmax_t remaining = fileSize;
        while (remaining > 0) {
            std::size_t toWrite = (remaining > bufferSize) ? bufferSize : static_cast<std::size_t>(remaining);
            file.write(buffer, toWrite);
            remaining -= toWrite;
        }

        file.close();
        std::cout << "File overwritten with ones (0xFF): " << filePath << "\n";
    }
    catch (const std::exception &e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }
}

int main() {
    std::string filePath;
    std::cout << "Enter file path to overwrite with ones: ";
    std::getline(std::cin, filePath);

    if (!fs::exists(filePath)) {
        std::cerr << "Error: File does not exist.\n";
        return 1;
    }

    overwriteFileWithOnes(filePath);
    return 0;
}
