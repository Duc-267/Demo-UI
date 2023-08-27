import React from 'react';
import './App.css';
import { Popover } from "react-text-selection-popover";
import { css } from '@emotion/css'
import audio from './audio.png'
import marker from './marker.png'
import magnifyingGlass from './magnifying-glass.png'

function App() {
  const [text, setText] = React.useState('')
  const [isQuickSearch, setIsQuickSearch] = React.useState(false)
  const [quickSearchText, setQuickSearchText] = React.useState('')

  function handleTextChange(text) {
    setText(text)
  }

  const escapeRegExp = (str = '') => (
    str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
  );

  const Highlighted = ({text = '', highlight = ''}) => {
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
         {parts.filter(part => part).map((part, i) => (
             regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
         ))}
     </span>
    )
 }


  return (
    <div className="App">
      <div className='Container'>
      <Highlighted text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." highlight={text} />
      <Popover
        render={
          ({ clientRect, isCollapsed, textContent }) => {
            if (isCollapsed) {
              setIsQuickSearch(false)
            }
            if (clientRect == null || isCollapsed) return null
            const style = css`
              position: absolute;
              left: ${isQuickSearch ? clientRect.right + clientRect.width : clientRect.left + clientRect.width}px;
              top: ${clientRect.top - 60}px;
              margin-left: -75px;
              background: gray;
              font-size: 14px;
              text-align: center;
              box-shadow: black 0px 0px 20px;
              border-radius: 3px;
              font-size: 14px;
              max-width: 200px;
              z-index: 22147483647;
              color: rgb(15, 33, 73);
              opacity: 0.97;
              background-color: white;
              line-height: 1.5em;
              vertical-align: baseline;
              text-align: left;
              box-shadow: black 0px 0px 20px;
              min-width: 90px;
              border-radius: 5px;
              width: auto;
              
              ${!isQuickSearch ? `
              &:before {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -10px;
                border-width: 10px;
                border-style: solid;
                border-color: white transparent transparent transparent;
              }
              ` : `
              &:before {
                content: "";
                position: absolute;
                top: 40%;
                right: 100%;
                margin-top: -10px;
                border-width: 10px;
                border-style: solid;
                border-color: transparent white transparent transparent;
              }`
              }

            `
            const iconButtonStyle = css`
              background: none;
              width: 20px;
              height: 20px;
              border: none;
              cursor: pointer;
              border-radius: 5px;
              padding: 10px;
              :hover {
                background: #E5E5E5;
              }
            `
            if (isQuickSearch) {
              return (
                <div className={style}>
                  <div style={
                    {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: '10px',
                      paddingRight: '10px'
                    }
                  }>
                    <p style={
                      {
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginBottom: '10px'
                      }
                    }>{quickSearchText}</p>
                    <img onClick={() => {console.log('pronoun')}} src={audio} alt="audio" style={
                      {
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }
                    } />
                  </div>
                  <p style={
                    {
                      fontSize: '14px',
                      marginBottom: '10px',
                      color: '#2F2D36',
                      paddingLeft: '10px',
                      paddingRight: '10px'
                    }
                  }>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut .
                  </p>
                </div>
              )

            }
            return <div className={style}>
              <img className={iconButtonStyle} src={marker} onClick={() => {handleTextChange(textContent)}}/>

              <img 
              src={magnifyingGlass}
              className={iconButtonStyle}
              onClick={() => {
                setIsQuickSearch(true)
                setQuickSearchText(textContent)
              }}/>
            </div>
          }
        }
      />
      </div>
    </div>
  );
}

export default App;
