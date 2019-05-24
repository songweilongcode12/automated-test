import React, { Component } from 'react';
import { translate } from 'react-i18next';
import {
  List,
  Input,
  Icon as AntdIcon,
  Avatar,
  Spin,
  Skeleton,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import {
  queryComments,
  createComment,
} from '../../data/graphql/comment';
import './Comments.less';

const prefix = 'bg-c-comments';

@translate()
class Comments extends Component {

  state = {
    loading: false,
    sendding: false,
    commentList: [],
    hasMore: true,
    commentText: '',
    totalPage: 0,
    currentPage: 0,
    pageSize: 20,
    loadingContent: true,
  }

  componentDidMount() {
    this.handleCommentsLoad(0);
  }

  handleCommentsLoad = async (currentPage) => {
    const { storeIDs, commentType, relationID } = this.props;
    const {
      pageSize,
      totalPage,
      loadingContent,
    } = this.state;

    if (currentPage > 0 && currentPage >= totalPage) {
      this.setState({
        loadingContent: false,
      })
      return;
    }

    if (!loadingContent) {
      this.setState({
        loading: true,
      });
    }

    const commentResp = await queryComments({
      storeIDs,
      commentType,
      relationID,
      search: {
        page: currentPage + 1,
        perPage: pageSize,
        includeTotal: true,
      },
    });

    const {
      data = [],
      pageInfo,
    } = commentResp;
    const { totalPages, current } = pageInfo;
    const { commentList } = this.state;

    this.setState({
      commentList: [
        ...commentList,
        ...(data || []),
      ],
      loading: false,
      currentPage: current,
      totalPage: totalPages,
      loadingContent: false,
    });
  }

  handleCommentsMore = () => {
    const { currentPage } = this.state;
    this.handleCommentsLoad(currentPage);
  }

  handleCommentChange = (evt) => {
    this.setState({
      commentText: evt.target.value,
    });
  }

  handelCommentSend = async () => {
    const { sendding, commentList, commentText } = this.state;
    if (sendding || commentText.length === 0) {
      return;
    }

    const { storeIDs = [], commentType, relationID } = this.props;
    let storeID = 0;
    if (storeIDs && storeIDs.length === 1) {
      [storeID] = storeIDs;
    } else {
      return;
    }

    this.setState({
      commentText: '',
      sendding: true,
    });

    const comment = await createComment({
      storeID,
      input: {
        commentType,
        relationID,
        content: commentText,
      },
    });

    this.setState({
      commentList: [
        comment,
        ...commentList,
      ],
      sendding: false,
    });
  }

  getCommentTime = (time) => {
    const commentYear = moment(Date.now()).year();
    const year = moment(time).year();
    const commentDayOfYear = moment(Date.now()).dayOfYear();
    const dayOfYear = moment(time).dayOfYear();
    const commentTime = [];

    if (commentDayOfYear === dayOfYear) { // 同一天
      commentTime.push(
        <div key="hours-minutes">{`${moment(time).format('HH:mm')}`}</div>
      );
    } else if (commentYear === year) {
      commentTime.push(
        <div key="month-day">{`${moment(time).format('MM-DD')}`}</div>
      );
      commentTime.push(
        <div key="hours-minutes">{`${moment(time).format('HH:mm')}`}</div>
      );
    } else {
      commentTime.push(
        <div key="month-day">{`${moment(time).format('YYYY-MM-DD')}`}</div>
      );
      commentTime.push(
        <div key="hours-minutes">{`${moment(time).format('HH:mm')}`}</div>
      );
    }

    return commentTime;
  }

  render() {
    const {
      loading,
      hasMore,
      commentText,
      commentList = [],
      loadingContent,
    } = this.state;
    const { t, storeIDs = [] } = this.props;

    return (
      <div className={prefix}>
        <div className={`${prefix}-list`}>
          <Skeleton
            active={true}
            loading={loadingContent}
            className="bg-galaxy-skeleton"
          >
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleCommentsMore}
              hasMore={!loading && hasMore}
              useWindow={false}
            >
              <List
                dataSource={commentList}
                locale={{ emptyText: t('common:noComment') }}
                renderItem={item => {
                  const { id, user, createdAt } = item;
                  const { displayName, avatarURLSmall } = user || {};
                  let avatar = null;

                  if (avatarURLSmall) {
                    avatar = (<Avatar src={avatarURLSmall} />);
                  } else {
                    avatar = (<Avatar icon="user" />);
                  }

                  return (
                    <List.Item key={id}>
                      <List.Item.Meta
                        avatar={avatar}
                        title={<span>{displayName}</span>}
                        description={item.content}
                      />
                      {this.getCommentTime(createdAt)}
                    </List.Item>
                  );
                }}
              />
            </InfiniteScroll>
          </Skeleton>
          {
            loading && hasMore && (
              <div className={`${prefix}-loading`}>
                <Spin />
              </div>
            )
          }
        </div>
        {
          storeIDs && storeIDs.length === 1 &&
          <div className={`${prefix}-comment`}>
            <Input.TextArea
              className={`${prefix}-comment-input`}
              onChange={this.handleCommentChange}
              value={commentText}
            />
            <AntdIcon
              type="enter"
              className={`${prefix}-comment-send`}
              onClick={this.handelCommentSend}
            />
          </div>
        }
      </div>
    );
  }
}

export default Comments;
