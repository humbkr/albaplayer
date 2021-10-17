#!/usr/bin/env bash

project_root="$(dirname "$(pwd)")"


echo "Enter version number: "
read version_number

echo "The script will now perform the following operations:"
echo "- build the production-ready react app"
echo "- insert version and build date in a version.txt file"

echo "Are you sure you want to continue?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done


# Generate react production build.
cd ${project_root}
yarn build

DATE=`date '+%Y-%m-%d %H:%M:%S'`

# Generate version file.
echo "Version: ${version_number}" >> ${project_root}/build/version.txt
echo "Build date: ${DATE}" >> ${project_root}/build/version.txt

echo "Version file generated."

current_branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

echo "Do you want to create a git tag and push it to the repo?"
echo "Current branch: ${current_branch}"
echo "Tag name: ${version_number}"
echo "Tag annotation: 'Alba player client v${version_number}'"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

if ! git diff-index --quiet HEAD --; then
    echo "WARNING: You have uncommitted changes in your workspace, are you sure you want to continue?"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) break;;
            No ) exit;;
        esac
    done
fi


echo "TODO git stuff."
