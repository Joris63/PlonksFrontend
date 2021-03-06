import _ from "lodash";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGlobalStore from "../../hooks/useGlobalStore";
import { FireToast } from "../../helpers/toasts.helpers";
import AddBoardItemModal from "./AddBoardItemModal";

const listFields = [
  {
    label: "Title",
    placeholder: "Your list title",
    whitespaces: true,
  },
];

const initialCardFields = [
  {
    label: "Title",
    placeholder: "your card title",
    whitespaces: true,
  },
  {
    label: "List",
    type: "select",
    options: [],
  },
];

const BoardHeader = ({ boardId }) => {
  const [cardFields, setCardFields] = useState(initialCardFields);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);

  const { auth } = useAuth();
  const { board, setBoard } = useGlobalStore();

  const axiosPrivate = useAxiosPrivate();

  async function FavoriteBoard(favorite) {
    await axiosPrivate
      .post(`/board/favorite`, {
        boardId,
        userId: auth?.user?.id,
        favorite,
      })
      .then((response) => {
        setBoard({ ...board, favorited: favorite });
      })
      .catch((err) => {
        if (!err?.response) {
          FireToast("No server response.", "error");
        } else if (err.response?.status === 401) {
          FireToast("Unauthorized.", "error");
        } else {
          FireToast("Something went wrong.", "error");
        }
      });
  }

  async function AddList(data) {
    await axiosPrivate
      .post(`/list/add`, { ...data, boardId })
      .then((response) => {
        const { data: list, message } = response?.data;

        setListModalOpen(false);

        const lists = [...board?.lists, list];

        setBoard({ ...board, lists });

        FireToast(message, "success");
      })
      .catch((err) => {
        if (!err?.response) {
          FireToast("No server response.", "error");
        } else if (err.response?.status === 401) {
          FireToast("Unauthorized.", "error");
        } else {
          FireToast("Something went wrong.", "error");
        }
      });
  }

  async function AddCard(data) {
    await axiosPrivate
      .post(`/card/add`, { title: data?.title, listId: data?.list })
      .then((response) => {
        const { data: card, message } = response?.data;

        setCardModalOpen(false);

        const updatedBoard = _.cloneDeep(board);
        const list = updatedBoard?.lists?.find(
          (list) => list.id === data?.list
        );

        const newCard = {
          id: card?.id,
          title: card?.title,
          order: card?.order,
          listId: card?.listId,
          hasDescription: card?.description === null ? false : true,
          commentAmount: 0,
          checkListItems: 0,
          completedChecklistItems: 0,
          createdAt: card?.createdAt,
        };

        list.cards.splice(list?.cards?.length, 0, newCard);

        setBoard(updatedBoard);

        FireToast(message, "success");
      })
      .catch((err) => {
        if (!err?.response) {
          FireToast("No server response.", "error");
        } else if (err.response?.status === 401) {
          FireToast("Unauthorized.", "error");
        } else {
          FireToast("Something went wrong.", "error");
        }
      });
  }

  useEffect(() => {
    const updatedCardFields = _.cloneDeep(cardFields);
    const listField = updatedCardFields.find((field) => field.label === "List");
    listField.options =
      board?.lists?.map((list, index) => ({
        name: list.title,
        abbr: list.id,
        active: index === 0 ? true : false,
      })) || [];

    setCardFields(updatedCardFields);
  }, [board]);

  return (
    <div className="board_header">
      <div className="board_title">{board?.title}</div>
      <button
        className={`board_page_icon_btn ${board?.favorited ? "favorite" : ""}`}
        onClick={(e) => {
          FavoriteBoard(!board?.favorited);
        }}
      >
        <i
          className={`animate__animated fa-${
            board?.favorited ? "solid animate__tada" : "regular"
          } fa-star`}
        ></i>
      </button>
      <button className="board_page_btn" onClick={() => setListModalOpen(true)}>
        <i className="fa-solid fa-plus"></i>
        <div>Add List</div>
      </button>
      {board?.lists?.length > 0 && (
        <button
          className="board_page_btn"
          onClick={() => setCardModalOpen(true)}
        >
          <i className="fa-solid fa-plus"></i>
          <div>Add Card</div>
        </button>
      )}
      <div className="board_members" style={{ marginLeft: "auto" }}>
        {board?.members
          ?.filter((member, index) => index < 5)
          .map((member) => (
            <div
              key={`board-${board?.id}-member-${member?.id}`}
              className="board_btn_member_wrapper"
            >
              {member?.picturePath ? (
                <img
                  className="board_btn_member"
                  src={member?.picturePath}
                  referrerPolicy="no-referrer"
                  alt="profile"
                />
              ) : (
                <div className="board_btn_member">
                  <i className={`fa-solid fa-${member.username.charAt()}`}></i>
                </div>
              )}
            </div>
          ))}
        {board?.members?.filter((member, index) => index >= 5).length > 0 && (
          <div className="board_btn_member_wrapper">
            <div className="board_btn_member add">
              +{board?.members?.filter((member, index) => index >= 5).length}
            </div>
          </div>
        )}
      </div>
      <button className="board_page_btn">
        <i className="fa-regular fa-user-plus"></i>
        <div>Share</div>
      </button>
      <button className="board_page_btn">
        <i className="fa-regular fa-filter"></i>
        <div>Filters</div>
      </button>
      <button className="board_page_btn">
        <i className="fa-regular fa-ellipsis"></i>
        <div>Show menu</div>
      </button>
      <AddBoardItemModal
        open={listModalOpen}
        handleClose={() => setListModalOpen(false)}
        fields={listFields}
        title="Create list"
        handleSubmit={(data) => AddList(data)}
      />
      {board?.lists?.length > 0 && (
        <AddBoardItemModal
          open={cardModalOpen}
          handleClose={() => setCardModalOpen(false)}
          fields={cardFields}
          title="Create card"
          handleSubmit={(data) => AddCard(data)}
        />
      )}
    </div>
  );
};

export default BoardHeader;
