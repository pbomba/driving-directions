
import React from 'react';
import './App.css';


class App extends React.Component {

  state = {
    text: 'Paste directions from GoogleMaps',
    formatted: []
  }

  addText = (e) => {
    this.setState({text: e.target.value})
  }

  parseText = () => {
    let noStreetView = []
    let textArray = this.state.text.split("\n")
    noStreetView = this.removeStreetView(textArray)
    let noHeadings = this.removeHeadings(noStreetView)
    let withDistance = this.addApproxDistance(noHeadings)
    let capped = this.capitalize(withDistance)
    this.setState({formatted: capped})
  }

  removeStreetView = (textArray) => {
    let arr = []
    let end = ""
    let i
    for (i = 0; i < textArray.length; i++) {
      if (textArray[i].substring(0,5) === " Dest") {
        end = textArray[i].trim()
      } else if (textArray[i] === "") {

      } else if (textArray[i] !== "Street View") {
        arr.push(textArray[i].trim())
      }
    }
    arr.push(end)
    return arr
  }

  removeHeadings = (array) => {
    let i
    let noHeadings = []
    for (i = 0; i < array.length; i++) {
      if (array[i].substring(array[i].length - 1) === ")") {
        noHeadings.pop()
      } else if (array[i].substring(0,7) === "Passing" || array[i].substring(0,7) === "Enterin" ) {
        // ignores "passing" or "entering" a state
      } else if (array[i].substring(0,7) === "Toll ro" ) {
        // adds "TOLL ROAD to prior index for toll roads"
        let temp = noHeadings.pop()
        temp = temp + " (TOLL ROAD)"
        noHeadings.push(temp)
      } else {
        noHeadings.push(array[i])
      }
    }
    return noHeadings
  }

  addApproxDistance = (array) => {
    let i
    let distArr = []
    let current = ""
    for (i = 0; i < array.length; i++) {
      if (array[i].slice(-3) === " mi" || array[i].slice(-3) === " ft") {
        current = current + ` (Approx. ${array[i]})`
      } else {
        if (current !== "") {
          distArr.push(current)  
        }
        current = array[i]
      }
    }
    distArr.push(current)
    return distArr
  } 

  capitalize = (array) => {
    let i
    for (i = 0; i < array.length; i++) {
      let j
      let patterns = [/\bHead north/, /\bHead south/, /\bHead east/, /\bHead west/,
                      /\bHead northeast/, /\bHead northwest/, /\bHead southeast/, /\bHead southwest/,
                      /\bturn left/, /\bturn right/, /\bTurn left/, /\bTurn right/,
                      /\bmerge/, /\bMerge/, /\bcontinue/, /\bContinue/, /\bcontinue straight/, /\bContinue straight/,
                      /\btake exit/, /\bTake exit/,
                      /\buse left lane/, /\buse right lane/, /\bUse left lane/, /\bUse right lane/,
                      /\bslight right/, /\bslight left/, /\bSlight right/, /\bSlight left/,
                      /\bKeep right/, /\bkeep right/, /\bkeep left/,/\bKeep left/ ]
      for (j = 0; j < patterns.length; j++){
        array[i] = array[i].replace(patterns[j], word => word.toUpperCase())
      }
    }
    return array
  }

  printDirections = () => {
    return (
      this.state.formatted.map(
        line => <li>{line}</li>)
      )
  }

  render (){
    return (
      <div className="App">
        <div className="Main">
          <h1>Driving Directions Formatter</h1>
          <textarea id="google-directions" cols="50" rows="10" value={this.state.value} onChange={this.addText} ></textarea>
          <div style={{height: 24, width: 2}}></div>
          <button onClick={this.parseText}>Parse</button>
          <ul style={{textAlign: "left", fontSize: 16}}>
            {this.printDirections()}
          </ul>
        </div>
      </div>
    )
  }
}

export default App;
