# Making it Interactive

## Today's Learning Objectives

We have our component set up with _state_, and now we will make it interactive.

## Your Mission

### Step 1. Components Structure

You should have at least 3 components in your code (if you have more, that's also good!) with the following structure:

```
- App
  └ Form
  └ TodoList
```

`Form` and `TodoList` are "siblings", and they are both contained in the parent component `App`.

It's important to have one `Form` component that contains both the input field and the button because they have to interact with each other.

If that is not your case, you need to adapt your code to this structure (again, it's not a problem if you just have _extra_ components).

### Step 2. The Form

Dealing with forms in React is pleasure and pain. There are two ways of dealing with forms: with _controlled_ components, and with _uncontrolled_ components.

The first technique gives you greater control, but it can visibly slow your application down if you have _a lot_ of fields, and/or _a lot_ of nested components.

The second technique is as fast as a browser can be and it's usually fine for a large part of use cases. For instance, you can check the value of a field and display an error message without waiting for the user to submit the form.

We are going to use _uncontrolled_ components to start.

Your `Form` component should look something like this:

```js
import React from "react";

export default function Form() {
  return (
    <div>
      <input type="text" placeholder="Write a new todo" />
      <br />
      <button>Add todo</button>
    </div>
  );
}
```

### Step 3. Click

When we click the button, we want a todo added to the list. So let's do the first thing: let's add a click handler function (empty for the moment), and an `onClick` property to the button.

_Side note: they are called "attributes" in HTML, but "properties" (most often abbreviated in "prop") in React. The reason will be clear later._

```js
import React from "react";

export default function Form() {
  function clickHandler() {
    // Something...
  }

  return (
    <div>
      <input type="text" placeholder="Write a new todo" />
      <br />
      <button onClick={clickHandler}>Add todo</button>
    </div>
  );
}
```

Now, we know that we have to, somehow, get the value of the input inside the `clickHandler` function. You might be tempted to add a _class_ or an _ID_ to the input field and retrieve it's value with `document.getElementById()`, `document.querySelector()` or something like that...

NEVER DO THAT IN REACT.

If you do that you break out of the React update cycle, really bad things will happen to your application, and you will have bad luck for 7 years. Mainly because it goes again the logic of React, which is to update the DOM only when the state changes. 

_Note: I shouldn't say "never", there are in fact extreme circumstances in which you have no alternative, but really specifics, so don't worry for now._

(The "React" way of referring to a DOM element is by using a thing called "ref" (short for _reference_). And there is a hook for that: useRef. We'll see this later.)

### Step 4. Getting the Value

We need to get the value of the input field. We can do that by using the `useState` hook. We will create a state variable to store the value of the input field, and a function to update it.


```js
import React, { useState } from "react";

export default function Form() {
  const [inputValue, setInputValue] = useState("");

  function clickHandler() {
    console.log(inputValue); // <- [1] bad bad bad ! (see why below) 
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Write a new todo"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <br />
      <button onClick={clickHandler}>Add todo</button>
    </div>
  );
}
```

>[1] For now, we'll log the state (synchronously) inside the function clickHandler. But this is a really bad idea because it will log the previous state. Indeed the update is asynchronous because it happens after the DOM is updated. So if you want to check the value of the state, you should use others ways: using the react devtools or with the `useEffect` hook. We'll see the second in the next chapter.

let's unpack the code:

- We import `useState` from React.
- We create a state variable `inputValue` and a function `setInputValue` to update it. The initial value of `inputValue` is an empty string.
- We add a `value` attribute to the input field. This is a _controlled_ component. The value of the input field is now controlled by React, and it will be updated every time the state variable `inputValue` changes.
- We add an `onChange` attribute to the input field. This is an event listener that will call the function `setInputValue` every time the value of the input field changes. The function will update the state variable `inputValue` with the new value of the input field.

Let's use the react devtools to check the value of the state !


### Step 5. Lifting State Up (Your Turn)

So now we have a click handler that can access whatever we write in the input field. And in our `TodoList` component – remember? – we have a state as an array with our todos.

How do we make the two components talk to each other?

The React way is called "lifting state up".

Instead of connecting the two components directly, we have to take the state in `TodoList` and the handler in `Form` and move them to the parent component `App`.

`App` will take the input value from the form and use it to update the state that is now under its control.

How to do that? Your job to find out. All I can say is that it will involve `App` passing variables and functions down to its children `TodoList` and `Form`. The way you pass variables down is by using "props". Do _not_ move HTML elements around. They are fine where they are.

#### IMPORTANT: Never modify the state directly!

What does it mean?

Imagine we have to deal with fruits in a basket. At the beginning our basket only has apples and pears, and we want to add bananas. You may be tempted to do something like this:

```js
// at the beginning of our component:
const [fruits, setFruits] = useState(["apples", "pears"]);

// later:
fruits.push("bananas"); // 🙅‍♂️  we add the item directly to the state array
setFruits(fruits); // 🙅‍♂️  we use the state array
```

This will cause all kind of really weird and impossible to debug problems, for reasons that are too complex to treat here (but feel free to read: https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly).

See, up there we modified the `fruits` array directly by pushing a new item (`'bananas'`), and then we passed that same array to the update function. As said, this will break your app in weird ways.

What then? We have to "clone" the state, before we modify and update it:

```js
// at the beginning of our component:
const [fruits, setFruits] = useState(["apples", "pears"]);

// later:
const newFruits = [...fruits]; // ✅  we "shallow clone" the array
newFruits.push("bananas"); // ✅  we add the item to the cloned array
setFruits(newFruits); // ✅  we use the cloned array
```

And one more thing: because of how JavaScript treats objects, a safer way to clone objects and arrays (which, remember, are just special objects) is to "deep clone" them. For example doing so:

```js
const newFruits = JSON.parse(JSON.stringify(fruits)); // ✅  we "deep clone" the array
```

but there's also a library called `limmer` that can do this for you.
<br>

> What is the difference between "shallow" and "deep" clone? 

A picture is worth a thousand words: https://stackoverflow.com/a/37830340/15337331

But this page of the official documentation is again a great resource: https://react.dev/learn/updating-objects-in-state.

### Step 6.

Done?

Just like yesterday, push your changes to GitHub and ping your coach on Discord so that he/she can check the code you wrote.

## Good Luck!
