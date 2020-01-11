import React, { useState, useEffect, Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';


//try
//https://github.com/clauderic/react-sortable-hoc
//https://codesandbox.io/s/react-sortable-hoc-starter-o104x95y86

//https://codesandbox.io/embed/interesting-wave-yw9ht

const About = () => {

  const SortableItem = SortableElement(({ name, index }) => (
    <div className="SortableItem">{name}</div>
  ));

  const SortableItemList = SortableContainer(({ items, disabled }) => (
    <ul>
      {items.map((name, index) => (
        <SortableItem
          collection="item"
          key={`item-${index}`}
          name={name}
          index={index}
          disabled={disabled}
        />
      ))}
    </ul>
  ));

  const SectionContainer = (props) => {
    console.log('SectionContainer props')
    console.log(props)
    const { section, idx, index, items, onSortEnd } = props;

    return (
      <div className="SortableSection">
        <h5>Section: {section}</h5>
        <SortableItemList
          items={items}
          onSortEnd={(e) => onSortEnd(idx,e)}
        />
      </div>
    );
  }

  const SortableSection = SortableElement(
    ({ section, idx, index, items, onSortEnd }) => {
    
      console.log('-SortableSection props')
      console.log({ section, idx, index, items, onSortEnd })
      

      
    //console.log({ section, index, items, onSortEnd })
//    for (let s of sections
    return (
      <SectionContainer
        section={section}
        idx={idx}
        index={index}
        items={items}
        onSortEnd={onSortEnd}
      />
    )
  }
);
const SortableSectionList = SortableContainer(
  ({ sections, onSectionSortEnd }) => {
    console.log('{sections, onSectionSortEnd }')
    console.log({ sections, onSectionSortEnd })
    return (
      <div>
        {sections.map(({ section, items }, index) => {
          console.log('{ section, items , index}')
          console.log({ section, items, index })
          return (
            <SortableSection
              collection="section"
              key={`item-${section}`}
              section={section}
              idx={index}
              index={index}
              items={items}
              onSortEnd={onSectionSortEnd}
            />
          )
        }
        )}
      </div>
    )
  }
);

const SortableComponent = () => {
  const [sections, setSections] = useState( [
      { section: "A", items: ["A1", "A2", "A3"] },
      { section: "B", items: ["B1", "B2"] }
    ] )
  
  function onSortEnd({ oldIndex, newIndex }) {
    console.log('old, new')
    console.log(oldIndex + ', ' + newIndex)

    setSections(arrayMove(sections,  oldIndex, newIndex ))
  }
  function onSectionSortEnd( sectionIndex, {oldIndex, newIndex } ) {
    
    console.log('{sectionIndex,  oldIndex, newIndex };')
    console.log({sectionIndex,  oldIndex, newIndex })
    const section = sections[sectionIndex]
    section.items = arrayMove(section.items, oldIndex, newIndex);  
    
    console.log('before sectionssssss')
    console.log(sections)
    setSections(prev => {
      let newS = prev
      newS[sectionIndex] = section
      
    console.log('after sectionssssss')
    console.log(newS)
      return newS
    })
  }
    return (
      <SortableSectionList
        sections={sections}
        onSortEnd={onSortEnd}
        onSectionSortEnd={onSectionSortEnd}
      />
    );
  }


  return (<SortableComponent />)
}

export default About;