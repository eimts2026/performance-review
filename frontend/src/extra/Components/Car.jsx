function Car(props) {
    return (
        <>
            <h2>My car is a {props.carinfo[0]} {props.carinfo[1]}!</h2>
        </>
    );
}

// function Garage() {
//   return (
//     <>
//       <h1>Who lives in my Garage</h1>
//       <Car color="red"/>
//       <Car color="blue"/>
//     </>
//   );
// }

// const carInfo = {
//   name: "Ford",
//   model: "Mustang",
//   color: "red",
//   year: 1969
// }

export default Car