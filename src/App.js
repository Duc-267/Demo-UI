import React from 'react';
import './App.css';
import { Popover } from "react-text-selection-popover";
import { css } from '@emotion/css'
import audio from './audio.png'
import marker from './marker.png'
import notes from './notes.png'
import magnifyingGlass from './magnifying-glass.png'
import { BlockPicker  } from 'react-color';

function App() {
  const [text, setText] = React.useState('')
  // const [isQuickSearch, setIsQuickSearch] = React.useState(false)
  const [toolTipType, setTooltipType] = React.useState('normal')
  const [quickSearchText, setQuickSearchText] = React.useState('')
  const [color, setColor] = React.useState('#fff')
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const [colorPickerElement, setColorPickerElement] = React.useState({left: 0, top: 0})
  const colorPickerRef = React.useRef(null)

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
    const style = css`
      background-color: ${toolTipType !== 'note' ? color : 'blue'};
      color: ${toolTipType !== 'note' ? 'black' : 'white'};
    `

    return (
      <span>
         {parts.filter(part => part).map((part, i) => (
             regex.test(part) ? <mark className={style} key={i} >{part}</mark> : <span key={i}>{part}</span>
         ))}
     </span>
    )
 }

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorPickerRef]);


  return (
    <div className="App">
      <div className='Container'>
      <Highlighted text="Dummy text refers to the bits of content that are used to fill a website mock-up. This text helps web designers better envision how the website will look as a finished product. It is important to understand that dummy text has no meaning whatsoever. Its sole purpose is to fill out blank spaces with “word-like” content, without making any copyright infringements." highlight={text} />
      { showColorPicker ?
        <div style={
          {
            position: 'absolute',
            left: colorPickerElement.left,
            top: colorPickerElement.top,
            zIndex: '999'
          }
        }
        ref={colorPickerRef}
        >
          <BlockPicker
            color={ color }
            onChangeComplete={ (color) => {setColor(color.hex)} }
          />
        </div> : null
        }
      <Popover
        render={
          ({ clientRect, isCollapsed, textContent }) => {
            if (isCollapsed) {
              if (toolTipType === 'note') {
                console.log("🚀 ~ file: App.js:49 ~ App ~ toolTipType:", toolTipType)
                handleTextChange('')
              }
              setTooltipType('normal')
              
            }
            if ((clientRect == null || isCollapsed)) return null
            const style = css`
              position: absolute;
              left: ${toolTipType === 'quickSearch' ? clientRect.right + clientRect.width : clientRect.left + clientRect.width / 2}px;
              top: ${toolTipType === 'note' ? clientRect.top - 140 : clientRect.top - 70}px;
              margin-left: -75px;
              background: gray;
              font-size: 14px;
              text-align: center;
              box-shadow: black 0px 0px 20px;
              border-radius: 3px;
              font-size: 14px;
              max-width: 200px;
              z-index: 1000;
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
              background: ${toolTipType === 'note' ? '#AFDC35' : 'white'};

              
              
              ${!(toolTipType === 'quickSearch') ? `
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
            if (toolTipType === 'quickSearch') {
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
            if (toolTipType === 'note') {
              // clear event listener
              return (
                <div className={style}>
                  <div style={
                    {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      cursor: 'none'
                    }
                  }>
                  </div>
                  <textarea style={
                    {
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      marginBottom: '10px',
                      marginTop: '10px',
                      color: '#2F2D36',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      zIndex: '22147483647412123',
                      resize: 'none',
                      height: '100px',
                      backgroundColor: '#AFDC35',
                    }
                  } placeholder='Add a note'/>
                </div>
              )
            }
            return <div className={style}>
              <img 
              className={iconButtonStyle} 
              src={marker} 
              onClick={() => {
                handleTextChange(textContent)
                setShowColorPicker(true)
                setColorPickerElement({left:  clientRect.left + clientRect.width / 3 , top: clientRect.top + 30})
              }}
              />
              <img 
                className={iconButtonStyle}
                src={notes} 
                onClick={() => {
                  setTooltipType('note')
                  handleTextChange(textContent)
                }}/>

              <img 
              src={magnifyingGlass}
              className={iconButtonStyle}
              onClick={() => {
                setTooltipType('quickSearch')
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
