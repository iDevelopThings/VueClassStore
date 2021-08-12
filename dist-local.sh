rm -R dist
yarn build-package
cp -R template dist/template
cp package.json dist/package.json
cp -R bin dist/bin
cp README.md dist/README.md

cp package.json dist/package.json



