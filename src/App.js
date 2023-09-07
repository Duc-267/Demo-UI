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
  const [toolTipType, setTooltipType] = React.useState('normal')
  const [quickSearchText, setQuickSearchText] = React.useState('')
  const [color, setColor] = React.useState('#fff')
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const [colorPickerElement, setColorPickerElement] = React.useState({left: 0, top: 0})
  const colorPickerRef = React.useRef(null)
  const [highlightedText, setHighlightedText] = React.useState([])

  function handleTextChange(text) {
    setText(text)
  }

  const escapeRegExp = (str = '') => (
    // clear spaces\
    str.trim().replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
  );

  const Highlighted =  ({currentText = ''}) => {

    if (!highlightedText.length && !text) {
      return <span>{currentText}</span>
    }
    const getCurrentText = (text) => {
      const regex = new RegExp(`(${escapeRegExp(text)})`, 'gi')
      const style = css`
        padding: px 0px;
        background-color: #3367D1;
        color: white;
      `
      return {
        regex,
        style
      }
    }
    const getHighlightedText = (text, color) => {
      const regex = new RegExp(`(${escapeRegExp(text)})`, 'gi')
      const style = css`
        padding: px 0px;
        background-color: ${color};
        color: black;
      `
      return {
        regex,
        style
      }
    }
    const texts = highlightedText.map((highlight) => {
      return getHighlightedText(highlight.text, highlight.color)
    })
    // add the current text to the list of texts
    if (text) {
      texts.push(getCurrentText(text))
    }
    //spit all the parts by the regex
    const regex = new RegExp(`(${texts.map(text => text.regex.source).join('|')})`, 'gi')
    const parts = currentText.split(regex)
    const reducedParts = parts.reduce((acc, part) => {
      if (part === undefined) return acc
      if (part === '') return acc
      if (acc.length === 0) return [part]
      const lastPart = acc[acc.length - 1]
      if (lastPart === part) return acc
      return [...acc, part]
    }
    , [])
    return (
      <span>
          {reducedParts.filter(part => part).map((part, i) => {
            const text = texts.find(text => text.regex.test(part))
            if (text) {
              return <mark className={text.style} key={i} >{part}</mark>
            }
            return <span key={i}>{part}</span>
          }
          )}
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
      <Highlighted currentText="Dummy text refers to the bits of content that are used to fill a website mock-up. This text helps web designers better envision how the website will look as a finished product. It is important to understand that dummy text has no meaning whatsoever. Its sole purpose is to fill out blank spaces with “word-like” content, without making any copyright infringements." />
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
            
            onChangeComplete={ (color) => 
            {
              setHighlightedText([...highlightedText, {text: text, color: color.hex}])
              setShowColorPicker(false)
              setColor('#fff')
            } 
            }
          />
        </div> : null
        }
      <Popover
        render={
          ({ clientRect, isCollapsed, textContent }) => {
            if (isCollapsed) {
              if (toolTipType === 'note') {
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
              ${toolTipType === 'note' && `
              &:before {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -10px;
                border-width: 10px;
                border-style: solid;
                border-color: #AFDC35 transparent transparent transparent;
              }
              `
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
              const linkStyle = css`
                font-size: 14px;
                color: #2F2D36;
                cursor: pointer;
                text-decoration: none;
                :hover {
                  color: #CC00FF;
                }

              `
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
                      paddingRight: '10px',
                      textDecoration: 'none'
                    }
                  }>Lorem ipsum dolor sit amet, 
                  <a 
                  className={linkStyle} 
                  href='https://www.figma.com/proto/GVLHyXzZ9qfowTl6nVJnSJ/Dictionary?type=design&node-id=494-1048&t=VuoXwPq5543QSI8W-0&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=301%3A433'
                  // open in new tab
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                    &nbsp;Key&nbsp; 
                  </a>
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut .
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
