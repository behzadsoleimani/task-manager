import { screen, render, fireEvent } from "@testing-library/react";
import Home from "../index"
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from '../../../redux/store'


const MockHomePage = () => (
    <Provider store={store}>
    <BrowserRouter>
    <Home />
    </BrowserRouter>
    </Provider>
)


describe("input change", () => {
    it("test input value after change", async () => {
        render(<MockHomePage />);
        const input = screen.getByPlaceholderText("Add a new board");
        fireEvent.change(input, {target: {value: "new board"}});
        expect(input.value).toBe("new board");
        const button = screen.getByTestId("addButton");
        fireEvent.click(button);
        expect(input.value).toBe("");
       
    })
});
