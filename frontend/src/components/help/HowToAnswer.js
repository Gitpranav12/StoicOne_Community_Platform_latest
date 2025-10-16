import React from 'react';
import { Container } from 'react-bootstrap';
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout

const HowToAnswer = () => {
    return (
        // 2. Wrap your page content in the Layout component
        <Layout>
            {/* 3. Your page's main content goes directly inside */}
            <Container fluid className="my-4 px-3 px-md-5">
                <div>
                    <h1 className="mb-4">How do I write a good answer?</h1>

                    <p>
                        Thanks for taking the time to write an answer. It’s because of helpful people like yourself that we’re able to learn together as a community. Here are a few tips on how to make your answer great:
                    </p>

                    <h4 className="mt-4">Read the question carefully</h4>
                    <p>
                        What is the question asking for? Make sure your answer provides that – or at least a viable alternative. Your answer can say “don’t do that,” but it should also say “try this instead.” Any answer that fully addresses at least part of the question is helpful and can get the asker going in the right direction. State any limitations, assumptions or simplifications in your answer. Brevity is acceptable, but fuller explanations are better.
                    </p>

                    <h4 className="mt-4">Provide context for links</h4>
                    <p>
                        Links to external resources are encouraged, but please add context around the link so your fellow users will have some idea what it is and why it’s there. Always quote the most relevant part of an important link, in case the external resource is unreachable or goes permanently offline. Links to other websites should always be <em>helpful</em>, but avoid making it <em>necessary</em> to click on them as much as possible.
                    </p>

                    <h4 className="mt-4">Have the same problem?</h4>
                    <p>
                        Help us find a solution by researching the problem. So long as you fully answer at least a part of the original question, then you can contribute the results of your research and anything additional you’ve tried. That way, even if you can’t figure it out, the next person has more to go on. You can also vote up the question or <a href="#">set a bounty</a> on it so the question gets more attention.
                    </p>

                    <h4 className="mt-4">Write to the best of your ability</h4>
                    <p>
                        We don't expect every answer to be perfect, but answers with correct spelling, punctuation, and grammar are easier to read. They also tend to get upvoted more frequently. Remember, you can always go back at any time and edit your answer to improve it.
                    </p>

                    <h4 className="mt-4">Pay it forward</h4>
                    <p>
                        Saying “thanks” is appreciated, but it doesn’t answer the question. Instead, vote up the answers that helped you the most! If these answers were helpful to you, please consider saying thank you in a more constructive way – by contributing your own answers to questions your peers have asked here.
                    </p>

                    <h4 className="mt-4">Answer <a href="#">well-asked</a> questions</h4>
                    <p>
                        Not all questions can or should be answered here. Save yourself some frustration and avoid trying to answer questions which…
                    </p>
                    <ul>
                        <li>…are unclear or lacking specific details that can uniquely identify the problem.</li>
                        <li>…solicit <a href="#">opinions</a> rather than facts.</li>
                        <li>…have <a href="#">already been asked</a> and answered many times before.</li>
                        <li>…require too much guidance for you to answer in full, or request answers to multiple questions.</li>
                        <li>…are not about programming as <a href="#">defined in the help center</a>.</li>
                    </ul>
                    <p>
                        Don't forget that you can <a href="#">edit the question you're answering</a> to improve the clarity and focus – this can reduce the chances of the question being closed or <a href="#">deleted</a>.
                    </p>

                    <h4 className="mt-4">Always be polite and have fun</h4>
                    <p>
                        It’s fine to disagree and express concern, but <a href="#">please be civil</a>. There’s always a real human being on the other end of that network connection, however misguided they may appear to be.
                    </p>
                </div>
            </Container>
        </Layout>
    );
};

export default HowToAnswer;