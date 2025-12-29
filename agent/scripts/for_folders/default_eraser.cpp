#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include<algorithm>
#include <random>

namespace fs = std::filesystem;

// Overwrite with a fixed byte
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

// Rename file to random name
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

bool renameFile(std::string &filePath) {
    fs::path p(filePath);
    fs::path newFile = p.parent_path() / generateRandomName();
    try {
        fs::rename(p, newFile);
        filePath = newFile.string(); // Update path for deletion
        std::cout << "File renamed to: " << filePath << "\n";
        return true;
    } catch (const std::exception &e) {
        std::cerr << "Rename failed: " << e.what() << "\n";
        return false;
    }
}


// ----------- Secure delete for file -----------
void secureDeleteFile(const std::string &originalPath) {
    std::string filePath = originalPath;

    if (!fs::exists(filePath) || !fs::is_regular_file(filePath)) {
        std::cerr << "Skipping (not a file): " << filePath << "\n";
        return;
    }

    std::cout << "Starting secure deletion for: " << filePath << "\n";

    // ---- Overwrite passes ----
    overwriteFile(filePath, 0x00);      // Pass 1: overwrite with 0x00
    overwriteFile(filePath, 0xFF);      // Pass 2: overwrite with 0xFF
    overwriteFileWithRandom(filePath);  // Pass 3: overwrite with random data

    // ---- Rename step ----
    if (!renameFile(filePath)) {  // Rename file to random name before deletion
        std::cerr << "Aborting deletion due to rename failure.\n";
        return;
    }

    // ---- Final deletion ----
    std::error_code ec;
    if (fs::remove(filePath, ec)) {
        std::cout << "File securely deleted.\n";
    } else {
        std::cerr << "Error deleting file: " << ec.message() << "\n";
    }
}

// ----------- Secure delete for folder -----------
void secureDeleteFolder(const std::string &folderPath) {
    if (!fs::exists(folderPath) || !fs::is_directory(folderPath)) {
        std::cerr << "Error: Folder does not exist.\n";
        return;
    }

    // First delete all files securely (overwrites + rename + delete)
    for (auto &entry : fs::recursive_directory_iterator(folderPath, fs::directory_options::skip_permission_denied)) {
        if (fs::is_regular_file(entry.path())) {
            secureDeleteFile(entry.path().string());  
            // Each file gets overwritten (3 passes), renamed, then deleted
        }
    }

    // Collect directories for bottom-up deletion
    std::vector<fs::path> dirs;
    for (auto &entry : fs::recursive_directory_iterator(folderPath, fs::directory_options::skip_permission_denied)) {
        if (fs::is_directory(entry.path())) {
            dirs.push_back(entry.path());
        }
    }

    // Delete subdirectories from deepest to shallowest
    std::sort(dirs.rbegin(), dirs.rend());
    for (auto &d : dirs) {
        std::error_code ec;
        fs::remove(d, ec);
    }

    // Finally delete the root folder itself
    std::error_code ec;
    fs::remove(folderPath, ec);
    if (!ec) {
        std::cout << "Folder securely deleted.\n";
    } else {
        std::cerr << "Error deleting folder: " << ec.message() << "\n";
    }
}