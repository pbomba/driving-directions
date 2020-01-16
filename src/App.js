
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
    // splits lines into array
    let textArray = this.state.text.split("\n")
    // formats starting and end points
    let startToFinish = this.identifyStartEnd(textArray)
    // removes any "street view" and puts Destination @ end
    let noStreetView = this.removeStreetView(startToFinish)
    // removes leg of journey headings, and some other messages
    let noHeadings = this.removeHeadings(noStreetView)
    // puts approximate distance
    let withDistance = this.addApproxDistance(noHeadings)
    // capitalizes certain terms
    let allCaps = this.capAll(withDistance)
    // remove some caps
    let decapped = this.decap(allCaps)
    // let capped = this.capitalize(withDistance)
    // let streetCapped = this.streetCapitalize(capped)
    let finished = this.finish(decapped)
    this.setState({formatted: finished})
  }

  identifyStartEnd = (array) => {
    // if first heading is a direction and there is time(dist) format
    if (array[0].substring(0,4) === "Head" && array[1].substring(array[1].length -1) === ")" ) {
      // removes all before and including "("
      array[1] = array[1].substring(array[1].indexOf("(") + 1 )
      // removes any other parens
     array[1] = array[1].replace(/[()]/g, '')
    // if last instruction is time(dist) format
    }
    if (array[array.length - 1].substring(array[array.length - 1].length - 1) === ")") {
      let k = array.length - 1
      array[k] = array[k].substring(array[k].indexOf("(") + 1)
      array[k] = array[k].replace(/[()]/g, '')
    }
    return array
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
    if (end !== "") {
      arr.push(end)
    }
    return arr
  }

  removeHeadings = (array) => {
    console.log(array[7].substring(0,7)==="Pass by")
    let i
    let noHeadings = []
    for (i = 0; i < array.length; i++) {
      if (array[i].substring(0,7) === "Pass by") {
        // ignores "Pass by mcDonalds"
        console.log("hit")
      } else if (array[i].substring(array[i].length - 1) === ")") {
        noHeadings.pop()
      } else if (array[i].substring(0,7) === "Passing" || array[i].substring(0,7) === "Enterin" || array[i].substring(0,7) === "Parts o" ) {
        // ignores "passing" or "entering" a state
      } else if (array[i].substring(0,7) === "Toll ro" ) {
        // adds "TOLL ROAD to prior index for toll roads"
        let temp = noHeadings.pop()
        temp = temp + " (toll road)"
        noHeadings.push(temp)
      } else if (array[i].substring(0,7) === "Pass by") {
        // ignores pass by and next element in array
        console.log("hit")
        i = i + 1
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
        current = current + ` (approx. ${array[i]})`
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

  // capitalize = (array) => {
  //   let i
  //   for (i = 0; i < array.length; i++) {
  //     let j
  //     let patterns = [/\bHead north/, /\bHead south/, /\bHead east/, /\bHead west/,
  //                     /\bHead northeast/, /\bHead northwest/, /\bHead southeast/, /\bHead southwest/,
  //                     // /\beast/, /\bwest/,/\bnorth/,/\bsouth/,
  //                     /\bright lane/, /\bleft lane/,
  //                     /\bturn left/, /\bturn right/, /\bTurn left/, /\bTurn right/,
  //                     /\bmerge/, /\bMerge/, /\bcontinue/, /\bContinue/, /\bcontinue straight/, /\bContinue straight/,
  //                     /\btake exit/, /\bTake exit/,
  //                     /\buse left lane/, /\buse right lane/, /\bUse left lane/, /\bUse right lane/,
  //                     /\bslight right/, /\bslight left/, /\bSlight right/, /\bSlight left/,
  //                     /\bKeep right/, /\bkeep right/, /\bkeep left/,/\bKeep left/ ]
  //     for (j = 0; j < patterns.length; j++){
  //       array[i] = array[i].replace(patterns[j], word => word.toUpperCase())
  //     }
  //   }
  //   console.log(array)
  //   return array
  // }

  capAll = (array) => {
    let i
    let allCaps = []
    for (i = 0; i < array.length; i++) {
      allCaps.push(array[i].toUpperCase())
    }
    return allCaps
  }

  decap = (array) => {
    let i
    for (i = 0; i < array.length; i++) {
      let j
      let patterns = [/\bFOLLOW/, /\b AT /, /\b ON /, /\b THE /, /\b FOR /,
                      /\b FORK /, /\b ONTO /, /\b TO /,
                      /\b STAY /, /\b SIGNS /,
                      /\b SIGN /, /\b AND /, /\bDESTINATION WILL BE on the RIGHT/,
                      /\bDESTINATION WILL BE on the LEFT/, /\b MI[)]/,
                      /\b FT/, /\b TOWARD/, /\bAPPROX/]
      for (j = 0; j < patterns.length; j++) {
        array[i] = array[i].replace(patterns[j], word => word.toLowerCase())
      }
    }
    return array
  }

  finish = (array) => {
    if (array[array.length - 1].substring(0,11) === "destination") {
      let finished = array[array.length - 1].replace(/\bd/, d => d.toUpperCase())
      array[array.length - 1] = finished
    }
    return array
  }

  // streetCapitalize = (array) => {
  //   let streetCap = []

  //   console.log ("array:", array)
  //   console.log ("streetCap:", streetCap)
  //   return streetCap
  // }

  printDirections = () => {
    return (
      this.state.formatted.map(
        line => <li key={line} >{line}</li>)
      )
  }

  render (){
    return (
      <div className="App">
        <div className="Main">
          <h1>Driving Directions Formatter</h1>
          <a href="http://paulbomba.com/locations-tools/" style={{color: "white", fontSize: 10}}>How to use</a>
          <div style={{height: 12, width: 2}}></div>
          <textarea id="google-directions" cols="50" rows="10" value={this.state.value} placeholder={"Paste directions from GoogleMaps"} onChange={this.addText}></textarea>
          <div style={{height: 24, width: 2}}></div>
          <button onClick={this.parseText}>Parse</button>
          <ul style={{textAlign: "left", fontSize: 16}}>
            {this.printDirections()}
          </ul>
          <div style={{height: 24, width: 2}}></div>
          <p style={{color: "white", fontSize: 10}}>created by Paul Bomba</p>
        </div>
      </div>
    )
  }
}

export default App;

// array[i].substring(0,7) === "Continu"
