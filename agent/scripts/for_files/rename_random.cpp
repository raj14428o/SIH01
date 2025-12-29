#include <iostream>
#include <string>
#include <filesystem>
#include <random>

namespace fs = std::filesystem;

std::string generateRandomName(size_t length = 12) {
    const char charset[] =
        "abcdefghijklmnopqrstuvwxyz"
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "0123456789";
    const size_t maxIndex = sizeof(charset) - 1;

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dist(0, maxIndex - 1);

    std::string name;
    for (size_t i = 0; i < length; ++i) {
        name += charset[dist(gen)];
    }
    return name;
}

int main() {
    std::string filePath;
    std::cout << "Enter file path to rename: ";
    std::getline(std::cin, filePath);

    if (!fs::exists(filePath)) {
        std::cerr << "Error: File does not exist.\n";
        return 1;
    }

    fs::path p(filePath);
    fs::path newFile = p.parent_path() / generateRandomName();

    try {
        fs::rename(p, newFile);
        std::cout << "File renamed to: " << newFile << "\n";
    } catch (const std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
