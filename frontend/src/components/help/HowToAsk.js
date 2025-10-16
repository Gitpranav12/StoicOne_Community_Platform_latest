import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout

const HowToAsk = () => {
    return (
        // 2. Wrap your page content in the Layout component
        <Layout>
            {/* 3. Your page's main content goes directly inside */}
            <Container fluid className="my-4 px-3 px-md-5">
                <div>
                    <h1 className="mb-4">How do I ask a good question?</h1>
                    <p>
                        We’re happy to help you, but in order to <strong>improve your chances</strong> of getting an answer,
                        here are some <strong>guidelines to follow</strong>:
                    </p>

                    <h3 className="mt-4">Make sure your question is <a href="#">on-topic</a> and <a href="#">suitable</a> for this site</h3>
                    <p>
                        Stack Overflow only accepts certain types of questions about programming and software development, and your question
                        <strong> must be written in English</strong>. If your question is not on-topic or is otherwise unsuitable for this site,
                        then it will likely be closed.
                    </p>
                    <p>
                        Closure is not the end of the road for questions; it is intended to be a temporary state until the question is revised
                        to meet our requirements. However, if you fail to do that, or it is impossible to do so, then the question will stay closed
                        and will not be answered.
                    </p>
                    <p>
                        Since you're reading this page, hopefully you will post a suitable, on-topic question from the outset, thus eliminating
                        the need for the closure and <a href="#">reopening</a> process!
                    </p>

                    <h4 className="mt-5">Search, and research</h4>
                    <p>
                        Before posting a question, we strongly recommend that you spend a reasonable amount of time researching the problem
                        and searching for existing questions on this site that may provide an answer. (Stack Overflow has been around for a
                        long time now, so many common questions have already been answered.)
                    </p>
                    <p>
                        Make sure to keep track of what you find when researching, even if it doesn’t help! If you ultimately aren’t able to
                        find the answer to your question elsewhere on this site, then including links to related questions (as well as an explanation
                        of why they didn’t help in your specific case) will help <a href="#">prevent your question from being marked as a duplicate</a>
                        when you ultimately do ask it.
                    </p>

                    <h4 className="mt-5">Write a title that summarizes the specific problem</h4>
                    <p>
                        The title is the first thing that potential answers will see. If your title isn't interesting, they won't read the rest.
                        Also, without a good title, people may not even be able to find your question. So, <strong>make the title count:</strong>
                    </p>

                    <ListGroup className="mb-4">
                        <ListGroup.Item>
                            <strong>Pretend you're talking to a busy colleague</strong> and have to sum up your entire question in one sentence:
                            what details can you include that will help someone identify and solve your problem? Include any error messages, key APIs,
                            or unusual circumstances that make your question different from similar questions already on the site.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Don't include tags in the title</strong>. The system will automatically prepend the most important tag to your
                            title for search-engine optimization purposes. You don't need to (and shouldn't) do it manually. If you want to include the name
                            of the language/library/framework/tool, do it in regular English, not as a bracketed tag.
                        </ListGroup.Item>
                        <ListGroup.Item>
                            If you're having trouble summarizing the problem, <strong>write the title last</strong>—sometimes, writing the rest of the question
                            first can make it easier to describe the problem.
                        </ListGroup.Item>
                    </ListGroup>

                    <h5 className="mt-4 mb-3">Examples:</h5>
                    <ListGroup className="mb-4">
                        <ListGroup.Item><strong>Bad:</strong> C# Math Confusion</ListGroup.Item>
                        <ListGroup.Item><strong>Good:</strong> Why does using float instead of int give me different results when all of my inputs are integers?</ListGroup.Item>
                        <ListGroup.Item><strong>Bad:</strong> [php] session doubt</ListGroup.Item>
                        <ListGroup.Item><strong>Good:</strong> How can I redirect users to different pages based on session data in PHP?</ListGroup.Item>
                        <ListGroup.Item><strong>Bad:</strong> android if else problems</ListGroup.Item>
                        <ListGroup.Item><strong>Good:</strong> Why does str == "value" evaluate to false when str is set to "value"?</ListGroup.Item>
                    </ListGroup>

                    {/* ... other content sections from your code ... */}

                    <h4 className="mt-5">Look for help asking for help</h4>
                    <p>
                        In spite of all your efforts, you may find your questions poorly-received. Don't despair!
                        Learning to ask a good question is a worthy pursuit, and not one you'll master overnight.
                        Here are some additional resources that you may find useful:
                    </p>
                    <ListGroup className="mb-4">
                        <ListGroup.Item><a href="#">Writing the perfect question</a></ListGroup.Item>
                        <ListGroup.Item><a href="#">How do I ask and answer homework questions?</a></ListGroup.Item>
                        <ListGroup.Item><a href="#">How to debug small programs</a></ListGroup.Item>
                        <ListGroup.Item><a href="#">Meta discussions on asking questions</a></ListGroup.Item>
                    </ListGroup>
                </div>
            </Container>
        </Layout>
    );
};

export default HowToAsk;