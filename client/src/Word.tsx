import React from 'react';
import logo from './logo.svg';
import { IWord } from './models/IWord';

const Word = (props: any) => {
  return (
    <button key={props.word.id} style={{ width: "20%", height: "20%", position: "relative" }}>{props.word.word}</button>
  );
}

export default Word;
