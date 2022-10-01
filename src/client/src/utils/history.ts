import { NavigateFunction } from "react-router-dom";

interface IHistory {
    navigate: null | NavigateFunction,
    push: (to: string) => void
}

const History: IHistory = {
    navigate: null,
    push: (to: string) => History.navigate!(to),
};

export default History;