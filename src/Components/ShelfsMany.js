import React from 'react'
import { Video } from './Video'
import { Shelf } from './Shelf'
export const ShelfsMany = props => {

  console.log('%%%%%%%%%%%%%%%%%% TOP ALL SHELFS %%%%%%%%%%%%%%%%%%')
  console.log("PROPS.SHELFS")
  console.log(props.shelfs)
  console.log('%%%%%%%%%%%%%%%%%% END ALL SHELFS %%%%%%%%%%%%%%%%%%')

return (
    <div> fomr many shelfs 
    {/*props.shelfs.map(vid => {
        return (
          <Video video={vid} />
        )
      })*/}
    {props.shelfs.map(sh => {
        return (
          <Shelf shelf={sh} />
        )
     })}
  </div>
    )
  }
