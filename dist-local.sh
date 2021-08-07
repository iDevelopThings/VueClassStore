rm -R dist
yarn build-package
cp -R template dist/template
cp package.json dist/package.json
cp -R bin dist/bin
cp README.md dist/README.md

cp package.json dist/package.json

cd dist || exit

npm link

cd /Users/sam/Code/RustGamblingSite/client || exit

npm link vue-class-stores

cd /Users/sam/Code/Packages/vue-cli-plugin-class-stores || exit

npm link vue-class-stores
