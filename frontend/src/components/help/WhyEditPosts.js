import React from 'react';
import { Container } from 'react-bootstrap';
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout

const WhyEditPosts = () => {
    return (
        // 2. Wrap your page content in the Layout component
        <Layout>
            {/* 3. Your page's main content goes directly inside */}
            <Container fluid className="my-4 px-3 px-md-5">
                <div>
                    <h1 className="mb-4">Why can people edit my posts? How does editing work?</h1>

                    <p>
                        All contributions are licensed under Creative Commons, and this site is collaboratively edited, like Wikipedia. If you see something that needs improvement, <a href="#">edit it!</a>
                    </p>

                    <p>
                        Editing is important for keeping posts clear, relevant, and up-to-date. If you are not comfortable with the idea of your contributions being collaboratively edited by other trusted users, this may not be the site for you.
                    </p>

                    <h4 className="mt-4">When should I edit posts?</h4>
                    <p>
                        Any time you see a post that needs improvement and are inclined to suggest an edit, you are welcome to do so.
                    </p>
                    <p>Some common reasons to edit a post are:</p>
                    <ul>
                        <li>To fix grammatical or spelling mistakes</li>
                        <li>To clarify the meaning of the post (without <em>changing</em> that meaning)</li>
                        <li>To include additional information only found in comments, so that all of the information relevant to the post is contained in one place</li>
                        <li>To correct minor mistakes or add updates as the post ages</li>
                        <li>To add related resources or hyperlinks</li>
                    </ul>
                    <p><strong>Tiny, trivial edits are discouraged;</strong> try to make the post significantly better when you edit, correcting all problems that you observe.</p>

                    <h4 className="mt-4">What happens when I edit a post?</h4>
                    <p>
                        The post will be updated to show the latest editor, as well as the original author. All edits are saved and tracked in a public revision history with attribution to each editor.
                    </p>
                    <p>
                        A post's revision history can be viewed by clicking the date and time at the bottom of the edited post (e.g., "edited 3 days ago").
                    </p>
                    <p>
                        Editing a question or answer also bumps the question to the top of the homepage.
                    </p>

                    {/* ... other content sections from your code ... */}

                    <h4 className="mt-4">What is a rollback?</h4>
                    <p>
                        A rollback reverts a post to a previous version in the edit history. The rollback action itself then appears as the most recent item in the edit history.
                    </p>
                </div>
            </Container>
        </Layout>
    );
};

export default WhyEditPosts;