// noinspection ES6UnusedImports
import { h } from 'preact';
import render from 'preact-render-to-json';
import Header from "../../components/Header";

test('Header component', () => {
    const tree = render(<Header title={"Lorem Ipsum"}/>);

    expect(tree).toMatchSnapshot();
});
