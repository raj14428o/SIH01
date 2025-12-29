#include <iostream>
#include <string>
#include <filesystem>

namespace fs = std::filesystem;

int main() {
    std::string filePath;
    std::cout << "Enter file path to delete: ";
    std::getline(std::cin, filePath);

    if (!fs::exists(filePath)) {
        std::cerr << "Error: File does not exist.\n";
        return 1;
    }

    try {
        fs::remove(filePath);
        std::cout << "File deleted successfully: " << filePath << "\n";
    } catch (const std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
