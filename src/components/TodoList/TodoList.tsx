import React, { useContext, useState } from "react";
import {
  GlobalTodoContext,
  TodoInputType,
} from "../../ContextApi/GlobalContext/GlobalTodoContext";
import { sanitizeInput } from "../../Utils/DomPurify";
import { TODO_INPUT_PATTERN } from "../Dashboard/Dashboard";
interface TodoListProps {
  allTodos: TodoInputType[];
}
/* //!todo 
1. alert message below add todo 
2. validation length for add subtask


*/
export default function TodoList({ allTodos }: TodoListProps) {
  //!states for the list
  const [activeAccordion, setActiveAccordion] = useState<string>("");
  const [errorMessage, setErrorMessage]=useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const { addNewSubtask } = useContext(GlobalTodoContext);
  //! handling Enter button click event to add subtask
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" ) {
        //!validation check
        if(!inputValue){
            setErrorMessage("This field can not be empty.");
            return
        }
        if(inputValue && inputValue.length<5){
            setErrorMessage('Todo length must be at least 5 characters');
            return
        }
      if (inputValue  && TODO_INPUT_PATTERN.test(inputValue)) {
        addNewSubtask(inputValue, activeAccordion);
        setInputValue("");
      }
      
      
    }
  };
  //!handling add button click for new subtask event
  const handleButtonClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    //!validation check 
    if(!inputValue){
        setErrorMessage("This field can not be empty.");
        return
    }
    if(inputValue && inputValue.length<5){
        setErrorMessage('Todo length must be at least 5 characters');
        return
    }
    if (inputValue && TODO_INPUT_PATTERN.test(inputValue)) {
      addNewSubtask(inputValue, activeAccordion);
      setInputValue("");
    }
    
  };
  const handleAccordionClick = (index: string) => {
    if (activeAccordion === index) {
      setActiveAccordion(""); // Collapse the accordion if it's already open
    } else {
      setActiveAccordion(index); // Open the clicked accordion item
    }
    setInputValue("");
    setErrorMessage('')
  };
  // console.log("acitve acroding", activeAccordion);
  return (
    <>
      <div id="accordionExample">
        {allTodos &&
          allTodos.map((todo, i) => {
            const isAccordionOpen = activeAccordion === todo.id;
            return (
              <div
                key={todo.id}
                className={` sm:w-full md:w-2/3 lg:w-2/3 xl:w-2/3 mx-auto rounded-t-lg border mb-1 border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800 transition-all duration-300 ${
                  isAccordionOpen ? "" : "overflow-hidden"
                }`}
              >
                <h2 className="mb-0 font-bold font-serif" id={`heading${todo.id}`}>
                  <button
                    className={`group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-neutral-800 transition-all duration-300 hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white ${
                      isAccordionOpen ? "" : "bg-white text-primary"
                    } dark:text-primary-400 ${
                      isAccordionOpen
                        ? "box-shadow:inset 0 -1px 0 rgba(229,231,235)"
                        : "box-shadow:inset 0 -1px 0 rgba(75,85,99)"
                    }`}
                    type="button"
                    data-te-collapse-init
                    data-te-target={`#collapse${todo.id}`}
                    aria-expanded={isAccordionOpen ? "true" : "false"}
                    aria-controls={`collapse${todo.id}`}
                    onClick={() => handleAccordionClick(todo.id)}
                  >
                    {todo.title}
                    <span
                      className={`ml-auto h-5 w-5 shrink-0 rotate-0 fill-[#336dec] transition-transform duration-200 ease-in-out group-${
                        isAccordionOpen ? "rotate-0" : "rotate-[-180deg]"
                      } group-${
                        isAccordionOpen ? "fill-[#212529]" : "fill-[#336dec]"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                </h2>
                <div
                  id={`collapse${i}`}
                  className={`${
                    isAccordionOpen ? "visible" : "hidden"
                  } transition-all duration-300`}
                  data-te-collapse-item
                  data-te-collapse-show
                  aria-labelledby={`heading${todo.id}`}
                  data-te-parent="#accordionExample"
                >
                  <div className="px-5 py-4 grid place-items-start gap-y-5">
                    <ul className=" w-full  ">
                      {todo.subTasks &&
                        todo.subTasks.map((subtask, i) => {
                          return (
                            <li
                              key={subtask.subTaskId}
                              className="w-full shadow rounded-lg mb-4 border p-2 text-primary-600"
                            >
                              {subtask.subtask}
                            </li>
                          );
                        })}
                      <div className="relative flex items-center  z-0">
                        <input
                          type="text"
                          id="floating_standard"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" add todo... "
                          value={inputValue}
                          onChange={(event) => {
                            //! sanitization of input fields
                            const sanitizedValue = sanitizeInput(
                              event.currentTarget.value
                            );
                            setInputValue(sanitizedValue);
                            setErrorMessage('')
                          }}
                          onKeyDown={handleKeyPress}
                        />
                       {
                        errorMessage &&  <label
                        htmlFor="floating_standard"
                        className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        {errorMessage}
                      </label>
                       }
                        <button
                          onClick={handleButtonClick}
                          className="bg-blue-500   hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6 "
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
