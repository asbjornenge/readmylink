import React from 'react'

export default class Sentence extends React.Component {
    render() {
        let classes = "Sentence"
        if (this.props.highlight) classes += ' highlight'
        return (
            <span className={classes}>{this.props.text}</span>
        )
    }
    setLang(msg) {
      if (this.props.languageIndex == -1) { msg.lang = 'en-US'; return }
      let voices = window.speechSynthesis.getVoices()
      msg.lang = voices[this.props.languageIndex].lang
    }
    setVoice(msg) {
      if (this.props.languageIndex == -1) return 
      let voices = window.speechSynthesis.getVoices()
      msg.voice = voices[this.props.languageIndex]
    }
    startReading() {
        speechSynthesis.cancel() // Clear previous errors...
        this.msg = new SpeechSynthesisUtterance()

        this.msg.onend = (event) => {
            delete this.msg
            if (this.props.read) this.props.onSpoken(this.props.index)
        }
        this.msg.onerror = (event) => {
            console.log('Errored ' + event)
        }

        this.setLang(this.msg)
        this.setVoice(this.msg)
        this.msg.text = this.props.text
        speechSynthesis.speak(this.msg)
    }
    componentDidUpdate() {
        if ( this.props.read && !this.msg) this.startReading() 
        if ( this.props.read &&  this.msg) speechSynthesis.resume()
        if (!this.props.read &&  this.msg) speechSynthesis.pause()
        if (this.props.readIndex != this.props.index && this.msg) {
            delete this.msg
            speechSynthesis.resume()
            speechSynthesis.cancel()
        }
    }
}
