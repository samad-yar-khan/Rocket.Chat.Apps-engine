import * as uuid from 'uuid/v1';
import { Omit } from '../../../lib/utils';
import { BlockType, IActionsBlock, IBlock, ICodeEditorBlock, IConditionalBlock, IConditionalBlockFilters, IContextBlock, IImageBlock, IInputBlock, ISectionBlock } from './Blocks';
import {
    BlockElementType,
    IBlockElement,
    IButtonElement,
    ICodeEditorElement,
    IImageElement,
    IInputElement,
    IInteractiveElement,
    IMultiStaticSelectElement,
    IOverflowMenuElement,
    IPlainTextInputElement,
    ISelectElement,
    IStaticSelectElement,
} from './Elements';
import { ITextObject, TextObjectType } from './Objects';

type BlockFunctionParameter<T extends IBlock> = Omit<T, 'type'>;
type ElementFunctionParameter<T extends IBlockElement> = T extends IInteractiveElement
    ? Omit<T, 'type' | 'actionId'> | Partial<Pick<T, 'actionId'>> : Omit<T, 'type'>;

type SectionBlockParam = BlockFunctionParameter<ISectionBlock>;
type ImageBlockParam = BlockFunctionParameter<IImageBlock>;
type ActionsBlockParam = BlockFunctionParameter<IActionsBlock>;
type ContextBlockParam = BlockFunctionParameter<IContextBlock>;
type InputBlockParam = BlockFunctionParameter<IInputBlock>;
type CodeEditorBlockParam = BlockFunctionParameter<ICodeEditorBlock>

type ButtonElementParam = ElementFunctionParameter<IButtonElement>;
type ImageElementParam = ElementFunctionParameter<IImageElement>;
type OverflowMenuElementParam = ElementFunctionParameter<IOverflowMenuElement>;
type PlainTextInputElementParam = ElementFunctionParameter<IPlainTextInputElement>;
type StaticSelectElementParam = ElementFunctionParameter<IStaticSelectElement>;
type MultiStaticSelectElementParam = ElementFunctionParameter<IMultiStaticSelectElement>;
type CodeEditorElementParam = ElementFunctionParameter<ICodeEditorElement>

export class BlockBuilder {
    private readonly blocks: Array<IBlock>;

    constructor(private readonly appId: string) {
        this.blocks = [];
    }

    public addSectionBlock(block: SectionBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.SECTION, ...block } as ISectionBlock);

        return this;
    }

    public addImageBlock(block: ImageBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.IMAGE, ...block } as IImageBlock);

        return this;
    }

    public addDividerBlock(): BlockBuilder {
        this.addBlock({ type: BlockType.DIVIDER });

        return this;
    }

    public addActionsBlock(block: ActionsBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.ACTIONS, ...block } as IActionsBlock);

        return this;
    }

    public addContextBlock(block: ContextBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.CONTEXT, ...block } as IContextBlock);

        return this;
    }

    public addInputBlock(block: InputBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.INPUT, ...block } as IInputBlock);

        return this;
    }

    public addConditionalBlock(innerBlocks: BlockBuilder | Array<IBlock>, condition?: IConditionalBlockFilters): BlockBuilder {
        const render = innerBlocks instanceof BlockBuilder ? innerBlocks.getBlocks() : innerBlocks;

        this.addBlock({ type: BlockType.CONDITIONAL, render, when: condition } as IConditionalBlock);

        return this;
    }

    public codeEditorBlock(block: CodeEditorBlockParam): BlockBuilder {
        this.addBlock({ type: BlockType.CODE_EDITOR, ...block } as ICodeEditorBlock);

        return this;
    }

    public getBlocks() {
        return this.blocks;
    }

    public newPlainTextObject(text: string, emoji: boolean = false): ITextObject {
        return {
            type: TextObjectType.PLAINTEXT,
            text,
            emoji,
        };
    }

    public newMarkdownTextObject(text: string): ITextObject {
        return {
            type: TextObjectType.MARKDOWN,
            text,
        };
    }

    public newButtonElement(info: ButtonElementParam): IButtonElement {
        return this.newInteractiveElement({
            type: BlockElementType.BUTTON,
            ...info,
        } as IButtonElement);
    }

    public newImageElement(info: ImageElementParam): IImageElement {
        return {
            type: BlockElementType.IMAGE,
            ...info,
       };
    }

    public newOverflowMenuElement(info: OverflowMenuElementParam): IOverflowMenuElement {
        return this.newInteractiveElement({
            type: BlockElementType.OVERFLOW_MENU,
            ...info,
        } as IOverflowMenuElement);
    }

    public newPlainTextInputElement(info: PlainTextInputElementParam): IPlainTextInputElement {
        return this.newInputElement({
            type: BlockElementType.PLAIN_TEXT_INPUT,
            ...info,
        } as IPlainTextInputElement);
    }

    public newStaticSelectElement(info: StaticSelectElementParam): IStaticSelectElement {
        return this.newSelectElement({
            type: BlockElementType.STATIC_SELECT,
            ...info,
        } as IStaticSelectElement);
    }

    public newMultiStaticElement(info: MultiStaticSelectElementParam): IMultiStaticSelectElement {
        return this.newSelectElement({
            type: BlockElementType.MULTI_STATIC_SELECT,
            ...info,
        } as IMultiStaticSelectElement);
    }

    private newInteractiveElement<T extends IInteractiveElement>(element: T): T {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }

        return element;
    }

    private newInputElement<T extends IInputElement>(element: T): T {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }

        return element;
    }

    public newCodeEditorElement(info: CodeEditorElementParam ): ICodeEditorElement {
        return ({
            type: BlockElementType.CODE_EDITOR,
            ...info
        }) as ICodeEditorElement;
    }

    private newSelectElement<T extends ISelectElement>(element: T): T {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }

        return element;
    }

    private addBlock(block: IBlock): void {
        if (!block.blockId) {
            block.blockId = this.generateBlockId();
        }

        block.appId = this.appId;

        this.blocks.push(block);
    }

    private generateBlockId(): string {
        return uuid();
    }

    private generateActionId(): string {
        return uuid();
    }
}
