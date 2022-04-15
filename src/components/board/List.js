import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";
import Card from "./Card";

const List = ({ list, index }) => {
  const customDragStyle = (style) => {
    if (!style?.transform) {
      return style;
    }

    if (
      parseInt(
        style.transform.slice(
          style.transform.indexOf("(") + 1,
          style.transform.indexOf(",") - 2
        )
      ) <
      index * -291
    ) {
      return {
        ...style,
        transform: "transform(0px, 0px)",
      };
    }

    const axisLockX = `${style.transform.split(",").shift()}, 0px)`;
    return {
      ...style,
      transform: axisLockX,
    };
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="list"
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={customDragStyle(provided.draggableProps.style)}
        >
          <header className="list_header" {...provided.dragHandleProps}>
            <div>
              <div className="list_title">{list.title}</div>
              {list?.cards?.length > 0 && (
                <div className="list_card_count">{list.cards?.length}</div>
              )}
            </div>
            <button className="list_option_btn">
              <i className="fa-regular fa-ellipsis-vertical"></i>
            </button>
          </header>
          <Droppable droppableId={`list-${list?.id}`} type="card">
            {(provided, snapshot) => (
              <div
                className="list_cards_container"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {List?.cards?.map((card, index) => (
                  <Card card={card} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default List;
