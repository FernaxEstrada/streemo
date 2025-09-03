'use client'

import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react"

const DataContext = createContext();

const dataInicial = {
  personas: null,
  usuarios: null,
  metodosPago: null,
  tarjetas: null,
  planes: null,
  pagosPlan: null,
  planesCupo: null,
  cuposVendidos: null,
  pagosCupo: null
}

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(dataInicial);

  const cambiarData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value
    }))
  }

  return (
    <DataContext.Provider value={{ data, cambiarData }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData debe usarse dentro del provider DataProvider");
  return context;
}