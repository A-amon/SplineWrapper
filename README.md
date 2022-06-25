# Spline Wrapper
[`react-map-gl`](https://github.com/visgl/react-map-gl) [`mapbox`](https://www.mapbox.com/)  

An unofficial plugin component for [react-map-gl](https://github.com/visgl/react-map-gl)

### Available functions
- Create curved lines (No more straight lines with sharp corners! 😉)
- Add arrow to end of lines (Hopefully, this is helpful! 🥳)

Here is a screenshot of the output after using both functions provided:
![image](https://github.com/A-amon/SplineWrapper/blob/main/map1.PNG)  
**Run this project to see the demo!** (Don't forget to add the token and map style first)

### Props
|Props|Description|
|-----|-----------|
|children| `Source` component|
|hasArrow| **Required for arrow**<br>`boolean` value to add arrow to lines|
|iconImage| **Required for arrow**<br>`string` value for name of icon image to be used for arrow|
|lines| `array` of `{from:[longitude, latitude], to:[longitude, latitude], properties:{}}`|

### Getting Started
#### Setup
- In your project directory, `npm install react-map-gl mapbox-gl d3`
- Download [SplineWrapper](https://github.com/A-amon/SplineWrapper/tree/main/src/components/SplineWrapper) directory and add it to your project  

#### How to use SplineWrapper
- Import the component: `import SplineWrapper from PATH/SplineWrapper`
- Already have an existing Source and Layer components? Don't have them yet? Not an issue! 😉  
```js
<Map>
  <SplineWrapper>
    //Copy&Paste or Create your Source and Layer components here
    <Source data={data}>
      <Layer/>
      ...
    </Source>
  </SplineWrapper>
</Map
```
- Want to add arrows? Just ensure you have loaded the icon ([Example: How to load an image 😁](https://github.com/A-amon/SplineWrapper/blob/2baf30b0fbd466a77060d669ec1774b67fd36040/src/App.js#L29)). Next, pass the `hasArrow` and `iconImage` props:  
```js
<SplineWrapper hasArrow={true} iconImage="arrow">
  ...
</SplineWrapper>
```
- Want curvy lines? Use `lines` props:  
```js
const lines = [
  {
    from:[51.5072, -0.1276],  // longitude, latitude
    to:[48.8566, 2.3522],     // longitude, latitude
    properties:{...}  // optional
  },
  {
    from:[48.8566, 2.3522],  // longitude, latitude
    to:[4.2105, 101.9758],     // longitude, latitude
    properties:{...}  // optional
  }
]
```
```js
<SplineWrapper lines={lines}>
  ...
</SplineWrapper>
```  
Still confused? Check out the example [here](https://github.com/A-amon/SplineWrapper/blob/main/src/App.js) 😁


### Notes
- There is no `control points` prop (to control the curve level/intensity) available at the moment **but might add it if lots of people need it**
- Curves are only applied to lines generated from the `lines` prop
- Load and add icon image before passing the name to `iconImage` prop
- The arrows are applied to every feature of type `LineString` (**including** those generated from `lines` prop)
- The arrow points to the direction of the line
- Since this is just a wrapper component, you should have almost full control over react-map-gl related uses
  
Enjoy this wrapper component!  


## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

