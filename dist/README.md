# Vue Class Stores

To quickly get started, you can navigate into the apptest directory to view a full working example. There's also a webpack.config.js showing the
implementation... or you can continue reading.

## Why?

For a while I've been doing my stores this way... but explaining to others how it works, how to generate the type definitions etc, was a little difficult. It's
also become a pain in the ass to assign the stores to the vue prototype & manually update the type definitions. This package will take care of the type
definitions and vue prototype manipulation to instantiate your stores.

I love managing my stores this way. Since I learned this method I can't go back, I also cannot stand React for this one single point. I like OO logic/structure
to my applications.

You can put your state and any methods you need all together in one store. Which can be used anywhere in your application, and it will keep it's state + stay
reactive.

Imagine you have some blog posts state, have a websocket connection which receives new blog posts. You can directly push these posts into the state from an
entirely different class/location.

## Getting Started

**Install the package**

```shell
npm install vue-class-stores
yarn add vue-class-stores
```

**Add to your webpack configuration:**

```js

const {WebpackStoreLoader} = require('vue-class-stores');

//....

plugins : [
	new VueClassStoresPlugin({
		// true = Using typescript
		// false = Using javascript
		// Ensure you set this correctly!  
		usingTypescript : false,
		// Where you want type definitions and the plugin to be defined
		pluginDirectory : 'src/Stores/Plugin',
		// Where your store classes are located
		storesDirectory : 'src/Stores',
		// When creating the global vue reference
		// shortVueDeclaration = true = $user
		// shortVueDeclaration = false = $userStore
		shortVueDeclaration : false,
	})
]
```

**Run a build of your application**

Now if you navigate to /src/Stores/ you will see a **Plugin** directory. These are the files that this package has built for you.

**VueStorePlugin** - This is an auto generated plugin for initiating your stores and registering them with Vue.

**VueStores** - This is an export of all your stores that will maintain state, it will allow you to use your stores in different classes and such.

**VueStoresTypeDefinitions.d.ts** - This should help your ide understand that you're using a store in your vuejs templates and understand that they're
registered with Vue.

**You can now add the plugin to your vue app**

```ts
import VueStorePlugin from "./Stores/Plugin/VueStorePlugin";

Vue.use(VueStorePlugin);

const app = new Vue({el : "#app"});
```

**Create a store:**

If you're using typescript, you can create a type for your store object and provide this as a generic to Store

```ts 
import {Store} from "vue-class-stores";

type UserStoreState = {
	user: object;
}

export class UserStore extends Store<UserStoreState> {
	setUser(user: any) {
		this.state.user = user;
	}
}
```

## Defining initial state/state object

You can use initialState() function. This provides the base state for your store, you can see this like vues data() object on a vuejs single file component.

```ts
import {Store} from "vue-class-stores";

type UserStoreState = {
	user: object;
}

export class UserStore extends Store<UserStoreState> {

	public initialState(): UserStoreState {
		return {
			user : {}
		};
	}

	setUser(user: object) {
		this.state.user = user;
	}
}

```

You can also do it this way

```ts
import {Store} from "vue-class-stores";

type UserStoreState = {
	user: object;
}

export class UserStore extends Store<UserStoreState> {

	public state = Vue.observable<UserStoreState>({});

	setUser(user: object) {
		this.state.user = user;
	}
}

```

## Using the stores in your code

**Example Store**:

```ts
import {Store} from "vue-class-stores";

type UserStoreState = {
	message: string;
}

export class UserStore extends Store<UserStoreState> {

	public state = Vue.observable<UserStoreState>({
		message : "Hello World"
	});

	get message() {
		return this.state.message;
	}

	set message(value) {
		this.state.message = value;
	}
}

```

Here's a few ways to use your store in your components

```vue

<template>
	<div>
		{{$userStore.message}}

		<button @click="$userStore.message = 'Hello!!!!'">Set hello message</button>
		<button @click="setMessage">Set fn message</button>
		<button @click="setMessageTwo">Set second fn message</button>
	</div>
</template>

<script lang="js">
import {userStore} from '@src/Stores/Plugin/VueStores';

export default {
	methods : {
		setMessage()
		{
			this.$userStore.message = 'Woop!';
		},
		setMessageTwo()
		{
			userStore.message = 'Woop!';
		}
	}
}
</script>
```

## You can use your stores anywhere in your application

```ts
import {userStore} from '@src/Stores/Plugin/VueStores';

export class SomeRandomService {
	doSomethingRandom() {
		userStore.message = 'Some random message';
	}
}

```
