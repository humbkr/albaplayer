#!/usr/bin/env bash

project_root="$(dirname "$(pwd)")"

echo "Enter version number: "
read version_number


# Clean previously generated files.
rm -rf ${project_root}/build/linux ${project_root}/build/macos ${project_root}/build/windows
rm -f ${project_root}/build/albaplayer-*
rm -f ${project_root}/build/version.txt
mkdir ${project_root}/build/linux ${project_root}/build/macos ${project_root}/build/windows

# Build for Linux.
echo "Start build for Linux..."
env GOOS=linux GOARCH=amd64 CGO_ENABLED=1 go build -o ${project_root}/build/linux/alba ${project_root}/main.go
echo "Finished."

# Build for MacOs.
echo "Start build for MacOs..."
env CC=o64-clang GOOS=darwin GOARCH=amd64 CGO_ENABLED=1 go build -o ${project_root}/build/macos/alba ${project_root}/main.go
echo "Finished."

# Build for Windows.
echo "Start build for Windows..."
env CC=x86_64-w64-mingw32-gcc GOOS=windows GOARCH=amd64 CGO_ENABLED=1 go build -o ${project_root}/build/windows/alba.exe ${project_root}/main.go
echo "Finished."

echo "Generate archives..."

# Generate version file.
DATE=`date '+%Y%m%d%H%M%S'`
echo "Version: ${version_number}" >> ${project_root}/build/version.txt
echo "Build date: ${DATE}" >> ${project_root}/build/version.txt


# Copy config and version files for each os.
cp ${project_root}/build/albaplayer.service ${project_root}/build/linux/albaplayer.service

cp ${project_root}/build/prod.alba.yml ${project_root}/build/linux/alba.yml
cp ${project_root}/build/prod.alba.yml ${project_root}/build/macos/alba.yml
cp ${project_root}/build/prod.alba.yml ${project_root}/build/windows/alba.yml

cp ${project_root}/build/version.txt ${project_root}/build/linux/version.txt
cp ${project_root}/build/version.txt ${project_root}/build/macos/version.txt
cp ${project_root}/build/version.txt ${project_root}/build/windows/version.txt


# Copy web directory for each os.
if [ ! -f ${project_root}/web/index.html ]; then
    echo "The frontend app seems to not be present in the /web directory, did you forget to build it?"
    exit 1
else
    cp -R ${project_root}/web ${project_root}/build/linux
    cp -R ${project_root}/web ${project_root}/build/macos
    cp -R ${project_root}/web ${project_root}/build/windows
fi

# zip / tar files.
cd ${project_root}/build
tar czf albaplayer-linux-${version_number}.tar.gz linux
zip -rq albaplayer-macos-${version_number}.zip macos
zip -rq albaplayer-windows-${version_number}.zip windows

echo "Application archives generated."
exit 0
