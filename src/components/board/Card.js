import { Draggable } from "react-beautiful-dnd";
import useGlobalStore from "../../hooks/useGlobalStore";

const Card = ({ card, index, listIndex, cardContainerRef }) => {
  const { setCardId } = useGlobalStore();

  const hasFooter =
    card?.hasDescription ||
    card?.commentAmount ||
    card?.checklistItems !== null;

  const customDragStyle = (style) => {
    if (!style?.transform) {
      return style;
    }

    let xAdjustment = parseInt(
      style.transform.slice(
        style.transform.indexOf("(") + 1,
        style.transform.indexOf(",") - 2
      )
    );

    let yAdjustment = parseInt(
      style.transform.slice(
        style.transform.indexOf(",") + 1,
        style.transform.indexOf(")") - 2
      )
    );

    if (xAdjustment < listIndex * -292) {
      xAdjustment = listIndex * -292;
    }

    const top = cardContainerRef?.current?.getBoundingClientRect()?.top;
    if (yAdjustment < -style.top + top) {
      yAdjustment = -style.top + top;
    }

    return {
      ...style,
      transform: `translate(${xAdjustment}px, ${yAdjustment}px)`,
    };
  };

  return (
    <Draggable draggableId={card?.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={customDragStyle(provided.draggableProps.style)}
          onClick={() => setCardId(card?.id)}
        >
          <header className="card_header">{card?.title}</header>
          {(card?.labels?.length > 0 || card?.members?.length > 0) && (
            <div className="card_content">
              <div className="card_labels_container">
                {card?.labels?.map((label) => (
                  <div className="card_label">{label.name}</div>
                ))}
              </div>
              <div className="card_members_container">
                {card?.members?.map((member) => (
                  <div className="card_member_wrapper">
                    <div className="card_member">
                      <i className="fa-regular fa-j"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasFooter && (
            <footer className="card_footer">
              {card?.hasDescription && (
                <div className="card_footer_info">
                  <i className="fa-regular fa-align-left"></i>
                </div>
              )}
              {card?.commentAmount > 0 && (
                <div className="card_footer_info">
                  <i className="fa-regular fa-comment"></i>
                  {card?.commentAmount}
                </div>
              )}
              {card?.checklistItems !== null && (
                <div className="card_footer_info">
                  <i className="fa-regular fa-square-check"></i>
                  {card?.completedChecklistItems}/{card?.checklistItems}
                </div>
              )}
            </footer>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
