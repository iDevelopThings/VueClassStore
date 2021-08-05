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

# shellcheck disable=SC1073
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g'
  | tr -d '[[:space:]]')

cd dist || exit

git add package.json
git add dist
git commit -m "Increment package version to $PACKAGE_VERSION"

npm publish --access public

cd ../ || exit
