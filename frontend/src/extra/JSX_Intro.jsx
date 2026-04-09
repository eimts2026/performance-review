// JSX Code Examples
const myElement = <h1>I Love JSX</h1>
const myElement2 = <h1>React is {5 + 5} times better than JSX</h1>
const myElement3 = (
  <ul>
    <li>Apples</li>
    <li>Bananas</li>
    <li>Cherries</li>
  </ul>
)

const myElement4 = (
  <>
    <p>I am a Paragraph</p>
    <p>I am a Paragraph too</p>
  </>
)

const myElement5 = <input type='text' />
const myElement6 = <h1 className='myclass'>Hello World</h1>
const myElement7 = <h1>Hello {/* Wonderful */} World</h1> // exmaple of comments in JSX

function Car() {
  const brand = "Ford"
  const model = "Mustang"
  return (
    <>
      <h2>My Car</h2>
      <p>It is a {brand} {model}.</p>
    </>
  );
}

function Car1() {
  return (
    <>
      <h1>My Car</h1>
      <p>It has {218 * 1.36} horsepower</p>
    </>
  );
}

function Car2() {
  const hp = 218 * 1.36
  return (
    <>
      <h1>My Car</h1>
      <p>It has {hp} horsepower</p>
    </>
  );
}

// Object Properties
function Car3() {
  const myObj = {
    name: "Fiat",
    model: "500",
    color: "white"
  }
  return (
    <>
    <h1>My car is a {myObj.color} {myObj.name} {myObj.model}</h1>
    </>
  );
}

function Car() {
  const x = "myClass"
  return (
    <>
    <h1 className={x}>Hello World</h1>
    </>
  );
}

function Car2() {
  const mystyles = {
    color: "red",
    fontSize: "20px",
    backgroundColor: "lightyellow",
  }

  const myfunc = () => {
    alert('Hello World');
  }

  return (
    <>
      <h1 style={mystyles}>My Car 2</h1>
      <button onClick={myfunc}>Click Me</button>
      <button onClick={myfunc} disabled>Disabled Button</button>
    </>
  );
}

function Fruit() {
  const x = 4;
  let y = "Apple";
  if (x < 10) {
    y = "Banana";
  }

  return (
    <h1>{y}</h1>
  );
}

function Fruit2() {
  const x = 5
  return (
    <h1>{(x) < 10 ? "Banana" : "Apple"}</h1>
  );
}

function Car(props) {
  return (
    <h2>I am a {props.brand}</h2>
  );
} 

function Garage() {
  return (
    <>
      <h1>Who lives in my garage?</h1>
      <Car brand="Ford"/>
    </>
  );
}

// Destructuring Props
function Car({color, brand, ...rest}) {
  return (
    <h2>My car is a {color} {rest.model} {brand}</h2>
  );
}

function Car2({color="blue", brand}) {
  return (
    <h2>My {color} {brand}!</h2>
  );
}

// Props Children
function Son(props) {
  return (
    <div styles={{background: 'lightgreen'}}>
      <h2>Son</h2>
      <div>{props.children}</div>
    </div>
  );
}

function Daughter(props) {
  const {brand, model} = props
  return (
    <div style={{background: 'lightblue'}}>
      <h2>Daughter</h2>
      <div>{props.children}</div>
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      <h1>My Two Children</h1>
      <Son>
        <p>
          This was written in the Parent component, but displayed as a part of the Son component
        </p>
      </Son>
      <Daughter>
        <p>
          This was written in the Parent component, but displayed as a part of the Daughter component
        </p>
      </Daughter>
    </div>
  );
}