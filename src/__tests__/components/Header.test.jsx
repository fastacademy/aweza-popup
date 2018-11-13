import preact from 'preact';
import render from 'preact-render-to-json';
import Header from "../../components/Header";

// /** @jsx preact.h */

test('component', () => {
    const tree = render(<Header title={"Lorem Ipsum"}/>);

    expect(tree).toMatchSnapshot();
});
