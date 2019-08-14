import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import cookie from 'react-cookies';
import {Button, Container, Dimmer, Header, Icon, Loader, Modal, Segment} from "semantic-ui-react";
import {
    FOLLOW_CLASS,
    FOLLOW_TEXT,
    FOLLOWING_CLASS,
    FOLLOWING_TEXT,
    UNFOLLOW_CLASS,
    UNFOLLOW_TEXT
} from "../../helpers/Constants";
import {FollowUser, GetUserFollowingData, UnfollowUser} from "../../services/FollowService";
import {Logout} from "../../services/LoginService";

export class FollowersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: 0,
            followingData: [],
            isLoading: false,
            isError: false
        };

        this.table = null;
    }

    componentDidMount() {
        GetUserFollowingData(cookie.load('user_id')).then((res) => {
            this.setState({followingData: res.data, userId: cookie.load('user_id')});
        }).catch(err => {
            this.setState({isError: true})
        });
    }

    /**
     * When the user clicks on the follow/unfollow button
     * @param event
     * @param data
     * @private
     */
    _handleClick = (event, data) => {
        const el = document.getElementById(data.id);
        const entityId = data.id.split('_')[2];
        const followingData = this.state.followingData.slice(0);
        const row = followingData.find(x => x.id === parseInt(entityId));

        if (!el) return;

        el.disabled = true; // for preventing multiple clicks

        if (el.classList.contains(UNFOLLOW_CLASS)) { // if unfollow user
            UnfollowUser(this.state.userId, entityId).then((res) => {
                el.classList.remove(UNFOLLOW_CLASS);
                el.classList.add(FOLLOW_CLASS);
                el.innerHTML = FOLLOW_TEXT;
                el.disabled = false;

                if (row) {
                    row.total_followers = row.total_followers > 0 ? parseInt(row.total_followers) - 1 : 0;
                    row.following = false;

                    this.setState({followingData});
                }
            }).catch(err => {
                this.setState({isError: true})
            });
        } else if (el.classList.contains(FOLLOW_CLASS)) { // if follow user
            FollowUser(this.state.userId, entityId).then((res) => {
                el.classList.remove(FOLLOW_CLASS);
                el.classList.add(FOLLOWING_CLASS);
                el.innerHTML = FOLLOWING_TEXT;
                el.disabled = false;

                if (row) {
                    row.total_followers = parseInt(row.total_followers) + 1;
                    row.following = true;

                    this.setState({followingData});
                }
            }).catch(err => {
                this.setState({isError: true});
            });
        }
    };

    /**
     * When the mouse hovering a button
     * @param event
     * @private
     */
    _handleMouseHover = (event) => {
        let el = document.getElementById(event.target.id);

        if (el && el.classList.contains(FOLLOWING_CLASS)) {
            el.classList.remove(FOLLOWING_CLASS);
            el.classList.add(UNFOLLOW_CLASS);
            el.innerHTML = UNFOLLOW_TEXT;
        }
    };

    /**
     * When the mouse is not hovering a button
     * @param event
     * @private
     */
    _handleMouseOut = (event) => {
        let el = document.getElementById(event.target.id);

        if (el && el.classList.contains(UNFOLLOW_CLASS)) {
            el.classList.remove(UNFOLLOW_CLASS);
            el.classList.add(FOLLOWING_CLASS);
            el.innerHTML = FOLLOWING_TEXT;
        }
    };

    /**
     * Logout
     * @private
     */
    _logout = () => {
        Logout().then(() => this.props.history.push('/login'));
    };

    render() {
        const columns = [{
            Header: 'Name',
            accessor: 'name' // String-based value accessors!
        }, {
            Header: 'Group',
            accessor: 'group_name'
        }, {
            Header: 'Number of followers',
            accessor: 'total_followers',
        }, {
            Header: '',
            accessor: 'id',
            Cell: props => {
                const id = props.original.id;
                const isFollowing = props.original.following;

                return <Button
                    compact
                    id={'follow_btn_' + id}
                    color={isFollowing ? FOLLOWING_CLASS : FOLLOW_CLASS}
                    content={isFollowing ? FOLLOWING_TEXT : FOLLOW_TEXT}
                    onMouseOver={this._handleMouseHover}
                    onMouseOut={this._handleMouseOut}
                    onClick={this._handleClick}>
                </Button>
            }
        }
        ];

        return (
            <div>
                <Container textAlign='left'>
                    <Dimmer active={this.state.isLoading}>
                        <Loader indeterminate>Loading...</Loader>
                    </Dimmer>

                    <div style={{
                        height: '2px'
                    }}/>

                    <Header as={'h2'} content={`Welcome ${cookie.load('username')}`}/>
                    <Header as={'h3'} content={'Choose users to follow'}/>
                    <ReactTable
                        data={this.state.followingData}
                        columns={columns}
                        defaultPageSize={10}
                        minRows={0}
                        ref={(r) => this.table = r}
                        noDataText={'No Users Yet...'}
                        pageSizeOptions={[5, 10]}
                        defaultSorted={[
                            {
                                id: "name",
                                desc: false
                            }
                        ]}
                        //filterable
                        className="-striped -highlight"
                        style={{
                            maxHeight: '80vh'
                        }}
                        getTrProps={(state, rowInfo, column) => {
                            return {
                                style: {
                                    textAlign: 'center',
                                    verticalAlign: 'middle'
                                }
                            }
                        }}
                    />

                    <Segment basic floated={'right'}>
                        <Button content={'Logout'} color={'blue'} size={'huge'} icon='right arrow'
                                labelPosition='right' onClick={this._logout}/>
                    </Segment>
                </Container>

                <Modal open={this.state.isError} basic size='small'>
                    <Header icon='delete' content='Error'/>
                    <Modal.Content>
                        <p>
                            We have encountered an error. Please try again...
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={() => this.setState({isError: false})}>
                            <Icon name='checkmark'/> Close
                        </Button>
                    </Modal.Actions>
                </Modal>

            </div>)
    }
}

export default FollowersPage;
