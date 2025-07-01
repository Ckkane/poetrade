import "../App.css";
import React, { useEffect, useState, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  addNewItems,
  setBulkItems,
  fetchUserById,
  setDivinePrice,
  saveItems,
  fetchLastPrices,
  switchAlertToggle,
  setConnectionStatus,
  getAlertToggle,
} from "../redux/slices/itemSlice";

import { IoRefresh, IoCheckmark } from "react-icons/io5";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import Graph from "./Graph";
import Alert from "./Alert";

function LeftSideMenu({ buyPrice, sortedLabels }) {
  const requestStatus = useSelector((state) => state.item.requestStatus);
  const lastData = useSelector((state) => state.item.lastData);
  const divinePrice = useSelector((state) => state.item.divinePrice);
  const graphData = useSelector((state) => state.item.graphData);
  const connectionStatus = useSelector((state) => state.item.connectionStatus);
  const [newMessage, setNewMessage] = useState(false);

  const [date, setDate] = useState(new Date());

  let nodeJsConnection = useRef(null);
  let sharpConnection = useRef(null);

  const dispatch = useDispatch();

  // function startSharpConnection(){
  // sharpConnection.current = new WebSocket('ws://192.168.0.14:999/');

  // let interval = setInterval(() => {
  //     sharpConnection.current.send(sharpConnection.current.readyState)
  // }, 20000);

  // sharpConnection.current.onopen = () => {
  //     console.log('sharp connection open')
  // }

  // sharpConnection.current.onclose = () => {
  //     console.log('sharp connection close')
  //     clearInterval(interval)
  // }

  // sharpConnection.current.onmessage = (message) => {
  //     let data = JSON.parse(message.data);

  //     console.log(data)

  //     if(data.tradeStatus === true){
  //         dispatch(switchAlertToggle(data.tradeStatus))
  //         return
  //     }else if(data.tradeStatus === false){
  //         dispatch(switchAlertToggle(data.tradeStatus))
  //         return
  //     }
  // }
  // }

  function startNodejsConnection() {
    nodeJsConnection.current = new WebSocket("ws://192.168.0.11:8999/");

    let interval = setInterval(() => {
      nodeJsConnection.current.send(nodeJsConnection.current.readyState);
    }, 20000);

    nodeJsConnection.current.onopen = () => {
      nodeJsConnection.current.send("start");
      dispatch(setConnectionStatus(true));
    };

    nodeJsConnection.current.onclose = () => {
      dispatch(setConnectionStatus(false));
      clearInterval(interval);
    };

    let x = true;

    nodeJsConnection.current.onmessage = (message) => {
      if (JSON.parse(message.data).message === true && x) {
        setNewMessage(true);
        x = false;

        setTimeout(function () {
          console.log("stop");
          setNewMessage(false);
          x = true;
        }, 5000);
        return;
      }

      let data = JSON.parse(message.data);
      let array = [];

      setDate(new Date());

      for (const key in data.result) {
        array.push(data.result[key]);
      }

      if (data.isBulkPrice) {
        let item = array[0];

        if (!buyPrice.get(item.listing.offers[0].item.currency)) {
          dispatch(
            setBulkItems({
              name: item.listing.offers[0].item.currency,
              price:
                item.listing.offers[0].exchange.amount /
                item.listing.offers[0].item.amount,
            })
          );
        }

        buyPrice.set(item.listing.offers[0].item.currency, {
          price:
            (item.listing.offers[0].exchange.amount /
              item.listing.offers[0].item.amount) *
            divinePrice,
        });

        return;
      }

      dispatch(addNewItems(array));
    };
  }

  function serializePrice() {
    let entries = buyPrice.entries();
    let sortedData = [];

    buyPrice.forEach(() => {
      sortedData.push(entries.next().value);
    });

    return sortedData;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "520px",
        position: "relative",
      }}
    >
      {newMessage ? <Alert /> : null}

      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(38, 52, 255, 0.25) 15%, rgba(149, 102, 255, 0.25) 100%)",
          borderRadius: "3px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          {connectionStatus ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "175px",
                alignItems: "center",
              }}
            >
              <p style={{ color: "white" }}>Connection status</p>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "green",
                  borderRadius: "300px",
                }}
              ></div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "175px",
                alignItems: "center",
              }}
            >
              <p style={{ color: "white" }}>Connection status</p>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "red",
                  borderRadius: "300px",
                }}
              ></div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "20px 0px",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "1px solid white",
              borderRadius: "3px",
              padding: "10px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              // startSharpConnection()
              startNodejsConnection();
            }}
          >
            {"start".toUpperCase()}
          </button>
          <button
            style={{
              background: "transparent",
              border: "1px solid white",
              borderRadius: "3px",
              padding: "10px",
              color: "white",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={() => {
              nodeJsConnection.current.close();
              // sharpConnection.current.close()
            }}
          >
            {"stop".toUpperCase()}
          </button>
        </div>
      </div>

      <div className="chel" style={{ width: "400px", height: "700px" }}></div>

      <div className="menu">
        {serializePrice().map((e) => {
          let config = JSON.parse(localStorage.getItem("config"));
          let item = config.items.filter((item) => item.itemName === e[0])[0];

          return (
            <div style={{ width: "400px" }}>
              <Accordion
                style={{
                  background:
                    "linear-gradient(90deg, rgb(38 52 255 / 25%) 15%, rgba(149, 102, 255, 0.25) 100%)",
                  boxShadow: "none",
                  width: "397px",
                  marginTop: "1px",
                }}
                slotProps={{ heading: { component: "h4" } }}
              >
                <AccordionSummary
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <img
                      height={25}
                      style={{ opacity: "0.2" }}
                      src={
                        "https://web.poecdn.com" +
                        (sortedLabels.get(e[0])
                          ? sortedLabels.get(e[0])
                          : sortedLabels.get("default"))
                      }
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "white",
                        marginLeft: "5px",
                      }}
                    >
                      {e[0].toUpperCase()}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{ height: "320px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {graphData.filter((elem) => elem.itemName === item.itemName)
                      .length >= 1 ? (
                      <div style={{ width: "250px", height: "80px" }}>
                        <Graph
                          data={graphData.filter(
                            (elem) => elem.itemName === item.itemName
                          )}
                        />
                      </div>
                    ) : null}
                    <div
                      style={{
                        width: "300px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px" }}>Price</span>
                      <input
                        name={`price-input-${e[0]}`}
                        style={{
                          maxWidth: "50px",
                          textAlign: "center",
                          borderRadius: "3px",
                          border: "none",
                          color: "rgb(104, 113, 130)",
                        }}
                        type="text"
                        defaultValue={Number(item.price / divinePrice).toFixed(
                          2
                        )}
                      />
                      <span style={{ fontSize: "12px" }}>Min count</span>
                      <input
                        name={`count-input-${e[0]}`}
                        style={{
                          maxWidth: "50px",
                          textAlign: "center",
                          borderRadius: "3px",
                          border: "none",
                          color: "rgb(104, 113, 130)",
                        }}
                        type="text"
                        defaultValue={1}
                      />
                      <button
                        onClick={() => {
                          let priceInput = document.getElementsByName(
                            `price-input-${e[0]}`
                          )[0];
                          let countInput = document.getElementsByName(
                            `count-input-${e[0]}`
                          )[0];
                          buyPrice.set(e[0], {
                            price: priceInput.value * divinePrice,
                          });
                          dispatch(
                            saveItems({
                              itemName: e[0],
                              price: priceInput.value * divinePrice,
                              minCount: countInput.value,
                            })
                          );
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {<IoCheckmark color="green" size={"1.5em"} />}
                      </button>
                    </div>
                    <div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "130px",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "30px",
                          }}
                        >
                          <span style={{ fontSize: "12px" }}>Count</span>
                          <input
                            name={e[0]}
                            style={{
                              maxWidth: "35px",
                              textAlign: "center",
                              borderRadius: "3px",
                              border: "none",
                              color: "#8f8f8f",
                            }}
                            type="text"
                            defaultValue={20}
                          />

                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onClick={(event) => {
                              let input = document.getElementsByName(e[0])[0];

                              dispatch(
                                fetchUserById({
                                  name: e[0],
                                  stock: input.value,
                                })
                              );

                              if (e[1].itemId !== undefined) {
                                dispatch(fetchLastPrices(e));
                              }
                            }}
                          >
                            <IoRefresh size={"1.5em"} />
                          </button>
                        </div>
                      </div>
                      {requestStatus === "fulfilled" ? (
                        <div style={{ padding: "0px 10px", height: "700px" }}>
                          {lastData
                            .filter((item) => item.name === e[0])
                            .map((elem) => {
                              let resultDivine = [];
                              let resultChaos = [];

                              for (const key in elem.data.divineData.result) {
                                resultDivine.push(
                                  elem.data.divineData.result[key]
                                );
                              }

                              for (const key in elem.data.chaosData.result) {
                                resultChaos.push(
                                  elem.data.chaosData.result[key]
                                );
                              }

                              return (
                                <div
                                  style={{ display: "flex", height: "150px" }}
                                >
                                  <div
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      flexDirection: "column",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "white",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {(
                                        "divine items found " +
                                        resultDivine.length
                                      )
                                        .toString()
                                        .toUpperCase()}
                                    </span>
                                    {resultDivine.slice(0, 5).map((each) => (
                                      <div
                                        style={{
                                          display: "flex",
                                          fontWeight: "500",
                                          width: "150px",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          padding: "3px",
                                          color: "rgb(104, 113, 130)",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "95px",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <span style={{ fontSize: "12px" }}>
                                            {each.listing.account.name
                                              .split("")
                                              .slice(0, 10)
                                              .join("")}
                                          </span>
                                        </div>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            width: "50px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {(
                                            each.listing.offers[0].exchange
                                              .amount /
                                            each.listing.offers[0].item.amount
                                          ).toFixed(2)}
                                        </span>
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            width: "50px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {each.listing.offers[0].item.stock}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      flexDirection: "column",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "white",
                                        fontWeight: "500",
                                        textAlign: "center",
                                      }}
                                    >
                                      {(
                                        "chaos items found " +
                                        resultChaos.length
                                      )
                                        .toString()
                                        .toUpperCase()}
                                    </span>
                                    {resultChaos.slice(0, 5).map((each) => (
                                      <div
                                        style={{
                                          display: "flex",
                                          fontWeight: "500",
                                          width: "200px",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          padding: "3px",
                                          color: "rgb(104, 113, 130)",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "100px",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <span style={{ fontSize: "12px" }}>
                                            {each.listing.account.name
                                              .split("")
                                              .slice(0, 10)
                                              .join("")}
                                          </span>
                                        </div>
                                        <div
                                          style={{
                                            width: "120px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              width: "50px",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              each.listing.offers[0].exchange
                                                .amount /
                                              each.listing.offers[0].item.amount
                                            ).toFixed(2)}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              width: "50px",
                                              textAlign: "center",
                                            }}
                                          >
                                            {(
                                              each.listing.offers[0].exchange
                                                .amount /
                                              each.listing.offers[0].item
                                                .amount /
                                              divinePrice
                                            ).toFixed(2)}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              width: "50px",
                                              textAlign: "center",
                                            }}
                                          >
                                            {each.listing.offers[0].item.stock}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            height={20}
                            style={{ opacity: "0.3" }}
                            src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeftSideMenu;
