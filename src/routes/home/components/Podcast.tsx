import React from "react";
import { h } from "preact";
import { IPodcastState } from "../index";

type BaseProps = Pick<IPodcastState, "image" | "state" | "subtitle" | "title">;
interface IProps extends BaseProps {
  onClick: (e: any) => void;
}

const DownloadSvg = () => (
  <svg viewBox="0 0 39 39">
    <circle
      class="action-progress"
      cx="19.5"
      cy="19.5"
      r="18"
      fill="none"
      stroke="#000"
      stroke-miterlimit="10"
      stroke-width="3"
      style="--progress: 0"
    />
    <path
      d="M26.5,18.5v7h-14v-7h-2v7a2,2,0,0,0,2,2h14a2,2,0,0,0,2-2v-7Zm-6,.67,2.59-2.58L24.5,18l-5,5-5-5,1.41-1.41,2.59,2.58V9.5h2Z"
      class="action-dl action-on"
    />
    <path
      d="M19.5,9.5a10,10,0,1,0,10,10A10,10,0,0,0,19.5,9.5Zm5,13.59L23.09,24.5,19.5,20.91,15.91,24.5,14.5,23.09l3.59-3.59L14.5,15.91l1.41-1.41,3.59,3.59,3.59-3.59,1.41,1.41L20.91,19.5Z"
      class="action-abort action-off"
    />
    <path
      d="M13.5,26.5a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2v-12h-12Zm13-15H23l-1-1H17l-1,1H12.5v2h14Z"
      class="action-del action-off"
    />
    <path
      d="M18.5,22.5h2v2h-2Zm0-8h2v6h-2Zm1-5a10,10,0,1,0,10,10A10,10,0,0,0,19.49,9.5Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,19.5,27.5Z"
      class="action-error action-off"
    />
  </svg>
);

const DeleteSvg = () => (
  <svg viewBox="0 0 39 39">
    <circle
      class="action-progress"
      cx="19.5"
      cy="19.5"
      r="18"
      fill="none"
      stroke="#000"
      stroke-miterlimit="10"
      stroke-width="3"
      style="--progress: 1"
    />
    <path
      d="M26.5,18.5v7h-14v-7h-2v7a2,2,0,0,0,2,2h14a2,2,0,0,0,2-2v-7Zm-6,.67,2.59-2.58L24.5,18l-5,5-5-5,1.41-1.41,2.59,2.58V9.5h2Z"
      class="action-dl action-off"
    />
    <path
      d="M19.5,9.5a10,10,0,1,0,10,10A10,10,0,0,0,19.5,9.5Zm5,13.59L23.09,24.5,19.5,20.91,15.91,24.5,14.5,23.09l3.59-3.59L14.5,15.91l1.41-1.41,3.59,3.59,3.59-3.59,1.41,1.41L20.91,19.5Z"
      class="action-abort action-off"
    />
    <path
      d="M13.5,26.5a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2v-12h-12Zm13-15H23l-1-1H17l-1,1H12.5v2h14Z"
      class="action-del action-on"
    />
    <path
      d="M18.5,22.5h2v2h-2Zm0-8h2v6h-2Zm1-5a10,10,0,1,0,10,10A10,10,0,0,0,19.49,9.5Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,19.5,27.5Z"
      class="action-error action-off"
    />
  </svg>
);

export default function Podcast({
  title,
  subtitle,
  image,
  onClick,
  state,
}: IProps) {
  return (
    <div class="flex flex-row">
      <img alt={`${title}-podcast`} src={image} width={100} height={100} />
      <div class="flex flex-col flex-1  ">
        <div class="font-semibold leading-5" onClick={onClick}>
          {title}
        </div>
        <div>{subtitle}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            border: "1px solid black",
            background: "#673ab8",
            color: "white",
          }}
        >
          {state === "not-stored" ? "Download" : "Remove"}
        </button>
      </div>
    </div>
  );
}
