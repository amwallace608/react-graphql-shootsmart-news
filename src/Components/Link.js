import React, {Component} from 'react'

//class for displaying single link elements
class Link extends Component {
  render () {
    //return link description and url
    return (
      <div>
        <div>
          {this.props.link.description} ({this.props.link.url})
        </div>
      </div>
    )
  }
}

export default Link