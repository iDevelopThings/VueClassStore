yarn build-package
rm -R dist
cp -R package dist
cp -R template dist/template
cp package.json dist/package.json
cp README.md dist/README.md

git add .
git commit -m "Built assets ready for publishing"

npm version patch
cp package.json dist/package.json

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

git add package.json
git add dist
git commit -m "Increment package version to $PACKAGE_VERSION"

cd dist || exit

npm publish --access public

cd ../ || exit
