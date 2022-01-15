import React, { useEffect, useState, useRef } from 'react'
import ReactPaginate from 'react-paginate';
import "./App.css";
import jQuery from "jquery";

export default function PaginationDynamic(){
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [Data, setData] = useState([]);
  const [count,setCount]= useState(0);
  const [apiData, setapiData] = useState([]);
  const [walletId, setWalletId]=useState("");
  const walletValue= useRef();

   useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=0x3bcf29061c89195419e4038bf4080ac6f24f4c3e"+walletId)
  //     var apiData = await response.json()
  //     console.log(apiData)
  //     setData(apiData)
       setPageCount(Math.ceil(apiData.length / perPage))
       setData(apiData.slice(offset, offset + perPage))
       //console.log("RANGE:"+offset+" "+(offset+perPage))
  //   }
  //   fetchData();
   }, [apiData,offset])

  function check() {

    if (walletId !== "") {
        const options = { method: 'GET' };
        //console.log("FUNCTION CALLED!!")
        fetch('https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=' + walletId, options)
            .then(response => response.json())
            .then(response => {
                //console.log(response);
                setapiData(response);
                for (var i = 0; i < response.length; i++) {
                    var obj = response[i];
                    var floor = jQuery.ajax({
                        type: 'GET',
                        global: false,
                        async: false,
                        url: 'https://api.opensea.io/api/v1/collection/' + obj.slug + '/stats',
                        success: function (res) {
                            return res;
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    }).responseJSON.stats.floor_price;
                    response[i].stats.floor_price=floor;
                    jQuery(".loader").hide();
                }
                setapiData(response);
            })
            .catch(err => console.error(err));
    }
    else {
        alert("Please enter your wallet addresss.");
        jQuery(".loader").hide();
    }

}

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage* perPage)

  }

  const callapi=(e)=>{
    e.preventDefault();
    console.log("WALLET ID IS: "+walletId);
    setCount(1);
    check();
  }

  const searchWallet=()=>{
    //console.log("changing..");
    setWalletId(walletValue.current.value);
  }

  return (
    <div className='Main_container'>

    <div className='SrcBox'>
      <form onSubmit={(e)=>callapi(e)}>
      
      <input ref={walletValue} type="text" onChange={searchWallet} placeholder="GIVE WALLET NUMBER"></input>
      </form>
    </div>


    <div className="container">
      {
        pageCount===0 && count!==0 ? <div className='loader'></div> : null
      }
      
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
    { pageCount!==0 ?
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
