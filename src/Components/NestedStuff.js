import React, { useState, useContext } from 'react';
import Sortable from 'sortablejs'

const SomeNestedElements = () => {
    return(
		<div id="nested" >
			<h4 >Nested Sortables Example</h4>
			<p>NOTE: When using nested Sortables with animation, it is recommended that the <code>fallbackOnBody</code> option is set to true. <br />It is also always recommended that either the <code>invertSwap</code> option is set to true, or the <code>swapThreshold</code> option is lower than the default value of 1 (eg <code>0.65</code>).</p>
			<div id="nestedDemo" className="list-group col nested-sortable">
				<div className="list-group-item nested-1">Item 1.1
					<div className="list-group nested-sortable">
						<div className="list-group-item nested-2">Item 2.1</div>
						<div className="list-group-item nested-2">Item 2.2
							<div className="list-group nested-sortable">
								<div className="list-group-item nested-3">Item 3.1</div>
								<div className="list-group-item nested-3">Item 3.2</div>
								<div className="list-group-item nested-3">Item 3.3</div>
								<div className="list-group-item nested-3">Item 3.4</div>
							</div>
						</div>
						<div className="list-group-item nested-2">Item 2.3</div>
						<div className="list-group-item nested-2">Item 2.4</div>
					</div>
				</div>
				<div className="list-group-item nested-1">Item 1.2</div>
				<div className="list-group-item nested-1">Item 1.3</div>
				<div className="list-group-item nested-1">Item 1.4
					<div className="list-group nested-sortable">
						<div className="list-group-item nested-2">Item 2.1</div>
						<div className="list-group-item nested-2">Item 2.2</div>
						<div className="list-group-item nested-2">Item 2.3</div>
						<div className="list-group-item nested-2">Item 2.4</div>
					</div>
				</div>
				<div className="list-group-item nested-1">Item 1.5</div>
			</div>
			
		</div>
)
}

export const Nested = () => {
  var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));
  console.log('NESTED nestedSortables')
  console.log(nestedSortables)
  // Loop through each nested sortable element
  for (var i = 0; i < nestedSortables.length; i++) {
    new Sortable(nestedSortables[i], {
      group: 'nested',
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65
    });
  }
  return (<SomeNestedElements/>)
}
      