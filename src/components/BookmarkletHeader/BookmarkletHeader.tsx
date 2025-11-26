import { memo } from 'react';
import { closeButtonStyles, headerStyles, titleStyles } from "./styles.ts";

interface BookmarkletHeaderProps {
	title: string;
	onClose: () => void;
	onMouseDown: (e: React.MouseEvent) => void;
}

const BookmarkletHeader = memo<BookmarkletHeaderProps>(
	({title, onClose, onMouseDown}) => {
		return (
			<div css={headerStyles} onMouseDown={onMouseDown}>
				<h3 css={titleStyles}>{title}</h3>
				<button
					css={closeButtonStyles}
					onClick={onClose}
					type="button"
					aria-label="Close"
				>
					✕
				</button>
			</div>
		);
	}
);

export default BookmarkletHeader;
