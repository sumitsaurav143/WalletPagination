import React, { useEffect, useState, useRef } from 'react'
import ReactPaginate from 'react-paginate';
import "./App.css";

export default function PaginationDynamic() {
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(12);
  const [pageCount, setPageCount] = useState(0)
  const [Data, setData] = useState([]);
  const [walletId, setWalletId]=useState("");
  const walletValue= useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.opensea.io/api/v1/collections')
      var apiData = await response.json()
      apiData=apiData.collections
      console.log(apiData)
      setData(apiData)
      setPageCount(Math.ceil(apiData.length / perPage))
      setData(apiData.slice(offset, offset + perPage))
      //console.log("RANGE:"+offset+" "+(offset+perPage))
    }

    fetchData()
  }, [walletId,offset])

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    //console.log(selectedPage * perPage)

    setOffset(selectedPage* perPage)

  }

  function searchWallet(e){
    e.preventDefault();
    setWalletId(walletValue.current.value)
  }
  return (
    <div className='Main_container'>

    <div className='SrcBox'>
      <form onSubmit={(e)=>searchWallet(e)}>
      <input ref={walletValue} type="text" placeholder="GIVE WALLET NUMBER"></input>
      </form>
    </div>


    <div className="container">
      {
        walletId!=="" ?
        Data.map((Data, index) => (
          //  Data.slug==walletId ?
          <div key={index} className="data_box">
             
              <div>
                <h4>NAME: {Data.name}</h4>
              </div>
              <div>
               <h5>FLOOR PRICE: {Data.stats.floor_price}</h5>
               </div>
          </div> 
         
          // : null
        ))
        : <h4>ENTER YOUR WALLET ID TO SHOW DETAILS</h4>
      }
        
    </div>
    { walletId!=="" ?
          <ReactPaginate
              previousLabel={"prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}/> : null}
      </div>
  )
}