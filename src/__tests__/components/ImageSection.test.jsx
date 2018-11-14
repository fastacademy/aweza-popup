// noinspection ES6UnusedImports
import { h } from 'preact';
import render from 'preact-render-to-json';
import ImageSection from "../../components/ImageSection";
import {terms} from "../dummydata";

test('ImageSection component', () => {
    const tree = render(<ImageSection image={terms[0].image}/>);

    expect(tree).toMatchSnapshot();
});
