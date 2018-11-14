// noinspection ES6UnusedImports
import {h} from 'preact';
import render from 'preact-render-to-json';
import {terms} from "../dummydata";
import Speaker from "../../components/Speaker";

function getComponent() {
    return (
        <Speaker
            uniqueId={`aweza-term-${terms[0].id}-text-audio`}
            audioUrl={terms[0].audio}
        />
    );
}

test('Speaker component', () => {
    const tree = render(getComponent());

    expect(tree).toMatchSnapshot();
});
